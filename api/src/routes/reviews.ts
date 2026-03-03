/**
 * GET /api/reviews
 * GET /api/reviews/:id
 * GET /api/reviews/project/:project_id  (convenience alias)
 */

import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { AppError } from '../middleware/errorHandler'
import { reviewsRepo } from '../db/repository'
import { REVIEWS } from '../db/mockData'

const router = Router()

// ─── Query schema ─────────────────────────────────────────────────────────────

const listSchema = z.object({
  page:       z.coerce.number().min(1).default(1),
  page_size:  z.coerce.number().min(1).max(50).default(10),
  // Filters
  project_id: z.string().optional(),
  rating:     z.coerce.number().int().min(1).max(5).optional(),
  // Sorting: newest (default) | oldest | helpful | rating
  sort:       z.enum(['newest', 'oldest', 'helpful', 'rating']).default('newest'),
})

// ─── GET /api/reviews ─────────────────────────────────────────────────────────

router.get('/', async (req: Request, res: Response) => {
  const q = listSchema.parse(req.query)

  const { data, total, avgRating } = await reviewsRepo.findMany({
    page:       q.page,
    page_size:  q.page_size,
    project_id: q.project_id,
    rating:     q.rating,
    sort:       q.sort,
  })

  // Aggregate stats for the full filtered set (not just this page)
  const approvedCount = REVIEWS.filter((r) => r.isApproved).length
  const recommend     = Math.round(
    (REVIEWS.filter((r) => r.isApproved && r.rating >= 4).length / Math.max(approvedCount, 1)) * 100,
  )

  res.json({
    data,
    meta: {
      total,
      page:        q.page,
      page_size:   q.page_size,
      total_pages: Math.ceil(total / q.page_size),
      avg_rating:  Math.round(avgRating * 10) / 10,
      recommend_pct: recommend,
    },
  })
})

// ─── GET /api/reviews/project/:project_id ─────────────────────────────────────

router.get('/project/:project_id', async (req: Request, res: Response) => {
  const q  = listSchema.parse({ ...req.query, project_id: req.params.project_id })
  const { data, total, avgRating } = await reviewsRepo.findMany({
    page:       q.page,
    page_size:  q.page_size,
    project_id: req.params.project_id,
    sort:       q.sort,
  })

  res.json({
    data,
    meta: {
      total,
      page:        q.page,
      page_size:   q.page_size,
      total_pages: Math.ceil(total / q.page_size),
      avg_rating:  Math.round(avgRating * 10) / 10,
    },
  })
})

// ─── GET /api/reviews/:id ─────────────────────────────────────────────────────

router.get('/:id', (req: Request, res: Response) => {
  const review = REVIEWS.find((r) => r.id === req.params.id && r.isApproved)
  if (!review) throw new AppError('Review not found', 404)
  res.json({ data: review })
})

export default router
