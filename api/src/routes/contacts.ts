import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import type { ContactLead } from '../types'
import { sendEmail, quoteConfirmationEmail, managerNotificationEmail } from '../integrations/email'
import { generateQuotePDFServer, buildQuoteFilename } from '../lib/generate-quote-pdf-server'
import type { QuoteData, CompletionType } from '../lib/generate-quote-pdf-server'

const router = Router()

// In-memory store — replace with database
const leads: ContactLead[] = []

const baseContactSchema = z.object({
  name: z.string().min(2, 'Имя обязательно').max(100),
  phone: z.string().min(10, 'Телефон обязателен').max(20),
  consent: z.literal(true, { errorMap: () => ({ message: 'Согласие обязательно' }) }),
})

const callSchema = baseContactSchema.extend({
  project: z.string().optional(),
})

// Kebab-case values from the frontend form
const CONFIG_KEBAB = ['without-finishing', 'with-finishing', 'turnkey'] as const

// Map frontend kebab values → QuoteData CompletionType (underscore)
const configToCompletion: Record<string, CompletionType> = {
  'without-finishing': 'without_finishing',
  'with-finishing':    'with_finishing',
  'turnkey':           'turnkey',
}

const quoteSchema = baseContactSchema.extend({
  email:         z.string().email('Некорректный email'),
  project:       z.string().min(1, 'Выберите проект'),
  configuration: z.enum(CONFIG_KEBAB),
  // Optional fields from the calculator — enables PDF attachment when present
  projectName:    z.string().optional(),
  projectArea:    z.number().optional(),
  priceBreakdown: z.object({
    materials:   z.number(),
    labor:       z.number(),
    overhead:    z.number(),
    delivery:    z.number().optional(),
    foundation:  z.number().optional(),
    utilities:   z.number().optional(),
    insurance:   z.number().optional(),
  }).optional(),
  totalPrice:     z.number().optional(),
  monthlyPayment: z.number().optional(),
  selectedOptions: z.array(z.string()).optional(),
})

const consultationSchema = baseContactSchema.extend({
  email: z.string().email().optional(),
  date: z.string().min(1, 'Выберите дату'),
  place: z.enum(['office', 'exhibition']),
  topic: z.string().optional(),
})

const customProjectSchema = baseContactSchema.extend({
  email: z.string().email('Некорректный email'),
  area: z.number().optional(),
  rooms: z.number().optional(),
  requirements: z.string().optional(),
})

function saveLead(type: ContactLead['type'], data: Record<string, unknown>): ContactLead {
  const lead: ContactLead = {
    id: uuidv4(),
    type,
    name: data.name as string,
    phone: data.phone as string,
    email: data.email as string | undefined,
    project: data.project as string | undefined,
    configuration: data.configuration as string | undefined,
    createdAt: new Date().toISOString(),
    status: 'new',
  }
  leads.push(lead)
  console.log(`[Lead] New ${type} lead:`, { id: lead.id, name: lead.name, phone: lead.phone })
  return lead
}

// POST /api/contacts/call
router.post('/call', (req: Request, res: Response) => {
  const data = callSchema.parse(req.body)
  const lead = saveLead('call', data)
  // TODO: send to Bitrix24, notify manager via email/telegram
  res.status(201).json({ data: { id: lead.id }, message: 'Заявка принята. Мы позвоним в течение 30 минут.' })
})

// POST /api/contacts/quote
router.post('/quote', async (req: Request, res: Response) => {
  let data: z.infer<typeof quoteSchema>
  try {
    data = quoteSchema.parse(req.body)
  } catch (err) {
    res.status(400).json({ error: 'Invalid request body', details: err })
    return
  }

  const lead = saveLead('quote', data)

  // ── PDF generation (only when calculator data is included) ──
  let pdfBuffer: Buffer | undefined
  const canGeneratePdf = !!(data.projectName && data.totalPrice && data.priceBreakdown)

  if (canGeneratePdf) {
    try {
      const quoteData: QuoteData = {
        projectId:       data.project,
        projectName:     data.projectName!,
        projectArea:     data.projectArea ?? 0,
        completionType:  configToCompletion[data.configuration],
        selectedOptions: (data.selectedOptions ?? []) as QuoteData['selectedOptions'],
        priceBreakdown:  data.priceBreakdown!,
        totalPrice:      data.totalPrice!,
        monthlyPayment:  data.monthlyPayment ?? 0,
        generatedAt:     new Date(),
      }
      console.log('[Contacts] Generating PDF for lead:', lead.id)
      pdfBuffer = await generateQuotePDFServer(quoteData)
      console.log('[Contacts] ✅ PDF generated, bytes:', pdfBuffer.length)
    } catch (pdfErr) {
      // Non-fatal — send email without attachment rather than failing the request
      console.error('[Contacts] ⚠️ PDF generation failed:', pdfErr)
    }
  }

  // ── Email to client ──
  try {
    const clientMail = quoteConfirmationEmail(
      data.name,
      data.email,
      data.projectName ?? data.project,
      lead.id,
      pdfBuffer,
    )
    await sendEmail(clientMail)
  } catch (emailErr) {
    console.error('[Contacts] ⚠️ Client email failed:', emailErr)
  }

  // ── Manager notification ──
  if (process.env.MANAGER_EMAIL) {
    try {
      await sendEmail(managerNotificationEmail(
        process.env.MANAGER_EMAIL,
        lead.id,
        'quote',
        data.name,
        data.phone,
      ))
    } catch (emailErr) {
      console.error('[Contacts] ⚠️ Manager notification failed:', emailErr)
    }
  }

  res.status(201).json({
    data: { id: lead.id },
    message: 'Запрос на расчёт принят. Смета будет отправлена на email.',
  })
})

// POST /api/contacts/consultation
router.post('/consultation', (req: Request, res: Response) => {
  const data = consultationSchema.parse(req.body)
  const lead = saveLead('consultation', data)
  // TODO: create calendar event, send confirmation email/SMS
  res.status(201).json({ data: { id: lead.id }, message: 'Консультация записана. Ждём вас!' })
})

// POST /api/contacts/custom-project
router.post('/custom-project', (req: Request, res: Response) => {
  const data = customProjectSchema.parse(req.body)
  const lead = saveLead('custom-project', data)
  // TODO: assign senior architect, send VIP notification
  res.status(201).json({ data: { id: lead.id }, message: 'Заявка на индивидуальный проект принята. Архитектор свяжется в течение 2 часов.' })
})

export default router
