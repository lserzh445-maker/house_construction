import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import type { ContactLead } from '../types'
import {
  sendEmail,
  callConfirmationEmail,
  quoteConfirmationEmail,
  managerNotificationEmail,
} from '../integrations/email'
import { generateQuotePDFServer } from '../lib/generate-quote-pdf-server'

const router = Router()

// In-memory store — replace with database in production
const leads: ContactLead[] = []

const baseContactSchema = z.object({
  name: z.string().min(2, 'Имя обязательно').max(100),
  phone: z.string().min(10, 'Телефон обязателен').max(20),
  consent: z.literal(true, { errorMap: () => ({ message: 'Согласие обязательно' }) }),
})

const callSchema = baseContactSchema.extend({
  email: z.string().email().optional().or(z.literal('')),
  project: z.string().optional(),
})

const quoteSchema = baseContactSchema.extend({
  email: z.string().email('Некорректный email'),
  project: z.string().min(1, 'Выберите проект'),
  configuration: z.enum(['without-finishing', 'with-finishing', 'turnkey']),
  // Optional calculator data — present when user submits form from the calculator page
  projectArea:    z.number().optional(),
  totalPrice:     z.number().optional(),
  monthlyPayment: z.number().optional(),
  priceBreakdown: z.object({
    materials:  z.number(),
    labor:      z.number(),
    overhead:   z.number(),
    delivery:   z.number().optional(),
    foundation: z.number().optional(),
    utilities:  z.number().optional(),
    insurance:  z.number().optional(),
  }).optional(),
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
router.post('/call', async (req: Request, res: Response) => {
  try {
    const data = callSchema.parse(req.body)
    const lead = saveLead('call', data)

    if (data.email) {
      sendEmail(callConfirmationEmail(data.name, data.email, lead.id)).catch((err) =>
        console.error('[Email] call confirmation failed:', err),
      )
    }

    if (process.env.MANAGER_EMAIL) {
      sendEmail(
        managerNotificationEmail(process.env.MANAGER_EMAIL, lead.id, 'Звонок', data.name, data.phone),
      ).catch((err) => console.error('[Email] manager notification failed:', err))
    }

    res.status(201).json({
      data: { id: lead.id },
      message: 'Заявка принята. Мы позвоним в течение 30 минут.',
    })
  } catch (error) {
    console.error('[Contacts/call] Error:', error)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' })
  }
})

// Maps contacts form configuration values → calculator completionType
const CONFIG_TO_COMPLETION: Record<string, 'base' | 'finishing' | 'turnkey'> = {
  'without-finishing': 'base',
  'with-finishing':    'finishing',
  'turnkey':           'turnkey',
}

const CONFIG_LABELS: Record<string, string> = {
  'without-finishing': 'Без отделки',
  'with-finishing':    'С отделкой',
  'turnkey':           'Под ключ',
}

// POST /api/contacts/quote
router.post('/quote', async (req: Request, res: Response) => {
  try {
    const data = quoteSchema.parse(req.body)
    const lead = saveLead('quote', data)

    // Optionally generate PDF if calculator data was sent with the form
    let pdfBuffer: Buffer | undefined
    if (data.priceBreakdown && data.totalPrice) {
      try {
        pdfBuffer = await generateQuotePDFServer({
          projectId:       data.project,
          projectName:     data.project,
          projectArea:     data.projectArea ?? 0,
          completionType:  CONFIG_TO_COMPLETION[data.configuration] ?? 'base',
          selectedOptions: data.selectedOptions ?? [],
          priceBreakdown:  data.priceBreakdown,
          totalPrice:      data.totalPrice,
          monthlyPayment:  data.monthlyPayment ?? 0,
          generatedAt:     new Date(),
        })
        console.log('[Contacts] ✅ PDF generated, size:', pdfBuffer.length, 'bytes')
      } catch (pdfErr) {
        console.error('[Contacts] ⚠️ PDF generation failed (email will be sent without attachment):', pdfErr)
      }
    }

    // Send confirmation email to client (with PDF attachment if generated)
    sendEmail(
      quoteConfirmationEmail(data.name, data.email, data.project, lead.id, pdfBuffer),
    ).catch((err) => console.error('[Email] quote confirmation failed:', err))

    // Notify manager
    if (process.env.MANAGER_EMAIL) {
      sendEmail(
        managerNotificationEmail(
          process.env.MANAGER_EMAIL,
          lead.id,
          'Расчёт стоимости',
          data.name,
          data.phone,
          {
            Email:        data.email,
            Проект:       data.project,
            Комплектация: CONFIG_LABELS[data.configuration] || data.configuration,
            ...(data.totalPrice ? { Сумма: String(data.totalPrice) + ' ₽' } : {}),
          },
        ),
      ).catch((err) => console.error('[Email] manager notification failed:', err))
    }

    res.status(201).json({
      data: { id: lead.id },
      message: pdfBuffer
        ? 'Запрос принят. Смета отправлена на ваш email.'
        : 'Запрос на расчёт принят. Письмо с подтверждением отправлено на ваш email.',
    })
  } catch (error) {
    console.error('[Contacts/quote] Error:', error)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' })
  }
})

// POST /api/contacts/consultation
router.post('/consultation', async (req: Request, res: Response) => {
  try {
    const data = consultationSchema.parse(req.body)
    const lead = saveLead('consultation', data)

    if (process.env.MANAGER_EMAIL) {
      sendEmail(
        managerNotificationEmail(
          process.env.MANAGER_EMAIL,
          lead.id,
          'Консультация',
          data.name,
          data.phone,
          { Дата: data.date, Место: data.place === 'office' ? 'Офис' : 'Выставка' },
        ),
      ).catch((err) => console.error('[Email] manager notification failed:', err))
    }

    res.status(201).json({
      data: { id: lead.id },
      message: 'Консультация записана. Ждём вас!',
    })
  } catch (error) {
    console.error('[Contacts/consultation] Error:', error)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' })
  }
})

// POST /api/contacts/custom-project
router.post('/custom-project', async (req: Request, res: Response) => {
  try {
    const data = customProjectSchema.parse(req.body)
    const lead = saveLead('custom-project', data)

    if (process.env.MANAGER_EMAIL) {
      sendEmail(
        managerNotificationEmail(
          process.env.MANAGER_EMAIL,
          lead.id,
          'Индивидуальный проект (VIP)',
          data.name,
          data.phone,
          { Email: data.email },
        ),
      ).catch((err) => console.error('[Email] manager notification failed:', err))
    }

    res.status(201).json({
      data: { id: lead.id },
      message: 'Заявка на индивидуальный проект принята. Архитектор свяжется в течение 2 часов.',
    })
  } catch (error) {
    console.error('[Contacts/custom-project] Error:', error)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' })
  }
})

export default router
