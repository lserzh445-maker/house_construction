/**
 * POST /api/forms/project
 * Custom project request (accepts multipart/form-data via JSON — files handled client-side).
 * TODO: receive uploaded files, create CRM lead with VIP priority, notify architect.
 */
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, phone, email } = req.body ?? {}
  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'name, phone and email are required' })
  }

  // TODO: file storage (S3), CRM lead (VIP type), architect assignment
  console.log('[ProjectForm] New custom project request:', { name, phone, email, ts: new Date().toISOString() })

  return res.status(200).json({ ok: true, message: 'Заявка на индивидуальный проект принята' })
}
