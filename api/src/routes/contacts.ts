import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import type { ContactLead } from '../types'

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

const quoteSchema = baseContactSchema.extend({
  email: z.string().email('Некорректный email'),
  project: z.string().min(1, 'Выберите проект'),
  configuration: z.enum(['without-finishing', 'with-finishing', 'turnkey']),
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
router.post('/quote', (req: Request, res: Response) => {
  const data = quoteSchema.parse(req.body)
  const lead = saveLead('quote', data)
  // TODO: generate PDF estimate, send to client email
  res.status(201).json({ data: { id: lead.id }, message: 'Запрос на расчёт принят. Смета будет отправлена на email.' })
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
