/**
 * POST /api/forms/quote
 * "Получить расчёт" — generates/sends a PDF quote.
 * TODO: generate PDF, send via email (SendGrid), create CRM lead.
 */
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, phone, projectId, completionType } = req.body ?? {}
  if (!name || !email || !phone || !projectId || !completionType) {
    return res.status(400).json({ error: 'All required fields must be provided' })
  }

  // TODO: PDF generation and email dispatch
  console.log('[QuoteForm] New quote request:', { name, email, phone, projectId, completionType, ts: new Date().toISOString() })

  return res.status(200).json({ ok: true, message: 'Расчёт отправлен на почту' })
}
