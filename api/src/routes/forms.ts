/**
 * POST /api/forms/call   — call-back request
 * POST /api/forms/quote  — quote / estimate request
 *
 * Both endpoints:
 *   1. Validate body with Zod
 *   2. Persist lead to the DB (mock repository → real Prisma when ready)
 *   3. Push lead to Bitrix24 CRM (stub)
 *   4. Send confirmation email to client + notification to manager (stub)
 */

import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { leadsRepo } from '../db/repository'
import { createBitrix24Lead, notifyManager } from '../integrations/bitrix24'
import {
  sendEmail,
  callConfirmationEmail,
  quoteConfirmationEmail,
  managerNotificationEmail,
} from '../integrations/email'
import { PROJECTS } from '../db/mockData'

const router = Router()

// ─── Shared base schema ───────────────────────────────────────────────────────

const base = z.object({
  name:    z.string().min(2, 'Имя обязательно (мин. 2 символа)').max(100),
  phone:   z.string().min(10, 'Укажите корректный номер телефона').max(20),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Необходимо согласие на обработку персональных данных' }),
  }),
})

// ─── /call schema ─────────────────────────────────────────────────────────────

const callSchema = base.extend({
  project_id: z.string().optional(),
})

// ─── /quote schema ────────────────────────────────────────────────────────────

const quoteSchema = base.extend({
  email:           z.string().email('Укажите корректный email'),
  project_id:      z.string().min(1, 'Выберите проект'),
  completion_type: z.enum(['base', 'finishing', 'turnkey'], {
    errorMap: () => ({
      message: 'Выберите комплектацию: base | finishing | turnkey',
    }),
  }),
})

// ─── POST /api/forms/call ─────────────────────────────────────────────────────

router.post('/call', async (req: Request, res: Response) => {
  const body = callSchema.parse(req.body)

  // 1. Persist
  const lead = await leadsRepo.create({
    type:       'call',
    name:       body.name,
    phone:      body.phone,
    project_id: body.project_id,
  })

  // 2. CRM (fire-and-forget — errors do not fail the response)
  void (async () => {
    const crmId = await createBitrix24Lead(lead)
    if (crmId) {
      void notifyManager(crmId, `Звонок — ${lead.name} (${lead.phone})`)
    }
  })()

  // 3. Email (fire-and-forget)
  void sendEmail({
    ...callConfirmationEmail(lead.name, lead.id),
    // client has no email on call form — send to manager only
    to: process.env.MANAGER_EMAIL ?? 'manager@domstroy.ru',
  })
  void sendEmail(
    managerNotificationEmail(
      process.env.MANAGER_EMAIL ?? 'manager@domstroy.ru',
      lead.id,
      'Заказать звонок',
      lead.name,
      lead.phone,
    ),
  )

  res.status(201).json({
    data:    { id: lead.id },
    message: 'Заявка принята. Мы позвоним в течение 30 минут в рабочее время.',
  })
})

// ─── POST /api/forms/quote ────────────────────────────────────────────────────

router.post('/quote', async (req: Request, res: Response) => {
  const body = quoteSchema.parse(req.body)

  // Resolve project name for the email
  const project = PROJECTS.find((p) => p.id === body.project_id || p.slug === body.project_id)
  const projectName = project?.name ?? body.project_id

  // 1. Persist
  const lead = await leadsRepo.create({
    type:            'quote',
    name:            body.name,
    phone:           body.phone,
    email:           body.email,
    project_id:      body.project_id,
    completion_type: body.completion_type,
  })

  // 2. CRM
  void (async () => {
    const crmId = await createBitrix24Lead(lead)
    if (crmId) {
      void notifyManager(
        crmId,
        `Расчёт — ${lead.name} / ${projectName} / ${body.completion_type}`,
      )
    }
  })()

  // 3. Email to client
  void sendEmail(quoteConfirmationEmail(lead.name, body.email, projectName, lead.id))

  // 4. Email to manager (high-priority)
  void sendEmail(
    managerNotificationEmail(
      process.env.MANAGER_EMAIL ?? 'manager@domstroy.ru',
      lead.id,
      `Расчёт — ${projectName} (${body.completion_type})`,
      lead.name,
      body.phone,
    ),
  )

  res.status(201).json({
    data:    { id: lead.id },
    message: 'Запрос принят. Смета будет отправлена на email в течение 2 часов.',
  })
})

export default router
