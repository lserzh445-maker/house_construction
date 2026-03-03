import { Router, Request, Response } from 'express'
import { z } from 'zod'
import type { Review, PaginatedResponse } from '../types'

const router = Router()

const MOCK_REVIEWS: Review[] = Array.from({ length: 15 }, (_, i) => ({
  id: `rev-${i + 1}`,
  author: ['Иван Петров', 'Мария Сидорова', 'Алексей Козлов', 'Ольга Новикова', 'Дмитрий Соколов'][i % 5],
  projectId: `project-${(i % 5) + 1}`,
  rating: 5 - (i % 2 === 0 ? 0 : 1),
  text: 'Отличный дом! Построили в срок, качество на высоте. Рекомендую всем.',
  date: new Date(2025, 11 - (i % 6), 15).toISOString().split('T')[0],
  videoUrl: i < 2 ? 'https://www.youtube.com/embed/placeholder' : undefined,
  helpful: 3 + i * 2,
  isApproved: true,
}))

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(10),
  rating: z.coerce.number().min(1).max(5).optional(),
  sortBy: z.enum(['newest', 'rating', 'helpful']).default('newest'),
})

// GET /api/reviews
router.get('/', (req: Request, res: Response) => {
  const { page, pageSize, rating, sortBy } = querySchema.parse(req.query)

  let reviews = MOCK_REVIEWS.filter((r) => r.isApproved)
  if (rating) reviews = reviews.filter((r) => r.rating === rating)

  if (sortBy === 'newest') reviews.sort((a, b) => b.date.localeCompare(a.date))
  else if (sortBy === 'rating') reviews.sort((a, b) => b.rating - a.rating)
  else reviews.sort((a, b) => b.helpful - a.helpful)

  const total = reviews.length
  const start = (page - 1) * pageSize
  const data = reviews.slice(start, start + pageSize)

  const response: PaginatedResponse<Review> = {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }

  res.json(response)
})

// GET /api/reviews/project/:projectId
router.get('/project/:projectId', (req: Request, res: Response) => {
  const reviews = MOCK_REVIEWS.filter(
    (r) => r.projectId === req.params.projectId && r.isApproved
  )
  res.json({ data: reviews })
})

export default router
