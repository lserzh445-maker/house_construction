import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { AppError } from '../middleware/errorHandler'
import type { BlogPost, PaginatedResponse } from '../types'

const router = Router()

const MOCK_POSTS: BlogPost[] = [
  { id: '1', slug: 'kak-vybrat-karkasnyi-dom', title: 'Как выбрать каркасный дом: 10 критериев', excerpt: 'Разбираем главные параметры выбора.', content: '<p>Полный текст статьи...</p>', image: '/images/blog/1.jpg', publishedAt: '2026-02-20', author: 'Алексей Петров', category: 'Выбор дома', readTime: 8, tags: ['выбор', 'советы'], metaDescription: 'Как выбрать каркасный дом — 10 ключевых критериев.' },
  { id: '2', slug: 'karkas-vs-brus-vs-kamen', title: 'Каркас vs брус vs камень', excerpt: 'Полное сравнение технологий строительства.', content: '<p>Полный текст статьи...</p>', image: '/images/blog/2.jpg', publishedAt: '2026-02-15', author: 'Мария Иванова', category: 'Технологии', readTime: 12, tags: ['сравнение'], metaDescription: 'Сравнение каркас vs брус vs камень.' },
  { id: '3', slug: 'ipoteka-2026', title: 'Ипотека на каркасный дом 2026', excerpt: 'Актуальные программы и условия.', content: '<p>Полный текст статьи...</p>', image: '/images/blog/3.jpg', publishedAt: '2026-02-10', author: 'Анна Смирнова', category: 'Финансирование', readTime: 6, tags: ['ипотека'], metaDescription: 'Ипотека на каркасный дом в 2026 году.' },
]

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(9),
  category: z.string().optional(),
  sortBy: z.enum(['latest', 'popular']).default('latest'),
})

// GET /api/blog
router.get('/', (req: Request, res: Response) => {
  const { page, pageSize, category } = querySchema.parse(req.query)

  let posts = [...MOCK_POSTS]
  if (category) posts = posts.filter((p) => p.category === category)

  posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  const total = posts.length
  const start = (page - 1) * pageSize
  const data = posts.slice(start, start + pageSize)

  const response: PaginatedResponse<BlogPost> = {
    data,
    meta: {
      total,
      page,
      page_size:   pageSize,
      total_pages: Math.ceil(total / pageSize),
    },
  }

  res.json(response)
})

// GET /api/blog/:slug
router.get('/:slug', (req: Request, res: Response) => {
  const post = MOCK_POSTS.find((p) => p.slug === req.params.slug)
  if (!post) throw new AppError('Post not found', 404)
  res.json({ data: post })
})

export default router
