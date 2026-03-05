/**
 * POST /api/forms/consultation
 * Books a consultation slot.
 * TODO: check availability, send confirmation email + SMS reminder.
 */
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, phone, email, dateTime, location, topic } = req.body ?? {}
  if (!name || !phone || !dateTime || !location) {
    return res.status(400).json({ error: 'name, phone, dateTime and location are required' })
  }

  const dt = new Date(dateTime)
  if (isNaN(dt.getTime()) || dt <= new Date()) {
    return res.status(400).json({ error: 'dateTime must be a future date' })
  }

  // TODO: calendar integration, confirmation email, SMS via Vonage
  console.log('[ConsultationForm] New booking:', { name, phone, email, dateTime, location, topic, ts: new Date().toISOString() })

  return res.status(200).json({ ok: true, message: 'Консультация забронирована' })
}
