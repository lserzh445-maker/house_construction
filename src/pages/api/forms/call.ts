/**
 * POST /api/forms/call
 * Receives a "call me back" request.
 * TODO: forward to CRM (Bitrix24) and send email notification.
 */
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, phone, projectId } = req.body ?? {}

  if (!name || !phone) {
    return res.status(400).json({ error: 'name and phone are required' })
  }

  // TODO: Bitrix24 CRM lead creation
  // TODO: email notification to manager
  console.log('[CallForm] New lead:', { name, phone, projectId, ts: new Date().toISOString() })

  return res.status(200).json({ ok: true, message: 'Заявка принята' })
}
