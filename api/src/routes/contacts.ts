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

// POST /api/contacts/quote
router.post('/quote', async (req: Request, res: Response) => {
  try {
    const data = quoteSchema.parse(req.body)
    const lead = saveLead('quote', data)

    const configLabels: Record<string, string> = {
      'without-finishing': 'Без отделки',
      'with-finishing': 'С отделкой',
      turnkey: 'Под ключ',
    }

    // Send confirmation email to client (no PDF — PDF is generated client-side)
    sendEmail(
      quoteConfirmationEmail(data.name, data.email, data.project, lead.id),
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
            Email: data.email,
            Проект: data.project,
            Комплектация: configLabels[data.configuration] || data.configuration,
          },
        ),
      ).catch((err) => console.error('[Email] manager notification failed:', err))
    }

    res.status(201).json({
      data: { id: lead.id },
      message: 'Запрос на расчёт принят. Письмо с подтверждением отправлено на ваш email.',
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
