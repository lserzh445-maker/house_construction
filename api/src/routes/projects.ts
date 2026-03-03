import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { AppError } from '../middleware/errorHandler'
import { projectsRepo } from '../db/repository'

const router = Router()

// ─── Query schema ─────────────────────────────────────────────────────────────

const listSchema = z.object({
  // Pagination
  page:      z.coerce.number().min(1).default(1),
  page_size: z.coerce.number().min(1).max(50).default(12),

  // Filters — snake_case to match spec
  price_from: z.coerce.number().min(0).optional(),
  price_to:   z.coerce.number().min(0).optional(),
  area_from:  z.coerce.number().min(0).optional(),
  area_to:    z.coerce.number().min(0).optional(),
  floors:     z.coerce.number().int().min(1).max(3).optional(),
  style:      z.enum(['finnish', 'canadian', 'modern', 'barnhouse']).optional(),
  category:   z.string().optional(),
  features:   z.string().optional(),  // comma-separated: terrace,sauna

  // Sorting: popularity | price_asc | price_desc | area_asc | area_desc | newest
  sort: z
    .enum(['popularity', 'price_asc', 'price_desc', 'area_asc', 'area_desc', 'newest'])
    .default('popularity'),
})

// ─── GET /api/projects ────────────────────────────────────────────────────────

router.get('/', async (req: Request, res: Response) => {
  const q = listSchema.parse(req.query)

  const features = q.features ? q.features.split(',').map((f) => f.trim()) : undefined

  const { data, total } = await projectsRepo.findMany({
    page:       q.page,
    page_size:  q.page_size,
    price_from: q.price_from,
    price_to:   q.price_to,
    area_from:  q.area_from,
    area_to:    q.area_to,
    floors:     q.floors,
    style:      q.style,
    category:   q.category,
    features,
    sort:       q.sort,
  })

  res.json({
    data,
    meta: {
      total,
      page:        q.page,
      page_size:   q.page_size,
      total_pages: Math.ceil(total / q.page_size),
    },
  })
})

// ─── GET /api/projects/:id ────────────────────────────────────────────────────

router.get('/:id', async (req: Request, res: Response) => {
  const project = await projectsRepo.findUnique(req.params.id)
  if (!project) throw new AppError('Project not found', 404)
  res.json({ data: project })
})

// ─── GET /api/projects/:id/similar ───────────────────────────────────────────

router.get('/:id/similar', async (req: Request, res: Response) => {
  const project = await projectsRepo.findUnique(req.params.id)
  if (!project) throw new AppError('Project not found', 404)

  const similar = await projectsRepo.findSimilar(project, 4)
  res.json({ data: similar })
})

export default router
