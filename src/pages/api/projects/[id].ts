/**
 * GET /api/projects/:id
 * Returns a single project + similar projects
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { getProjectById, getSimilarProjects } from '@/lib/catalogFilter'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const id = req.query.id as string
  const project = getProjectById(id)

  if (!project) {
    return res.status(404).json({ error: 'Project not found' })
  }

  const similar = getSimilarProjects(id, 4)

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  res.json({ project, similar })
}
