import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { AppError } from '../middleware/errorHandler'
import type { Project, PaginatedResponse } from '../types'

const router = Router()

// Mock data — replace with database queries (Prisma/TypeORM)
const MOCK_PROJECTS: Project[] = Array.from({ length: 20 }, (_, i) => ({
  id: `project-${i + 1}`,
  name: ['Финский дом Д-5', 'Барнхаус Б-3', 'Современный С-1', 'Канадский К-2'][i % 4] + ` (${i + 1})`,
  slug: `project-${i + 1}`,
  description: 'Просторный каркасный дом с продуманной планировкой и высокими теплоизоляционными характеристиками.',
  price: {
    basePrice: 4500000 + i * 500000,
    withFinishing: (4500000 + i * 500000) * 1.2,
    turnkey: (4500000 + i * 500000) * 1.4,
  },
  characteristics: {
    area: 55 + i * 8,
    size: `${6 + (i % 4)}x${7 + (i % 3)}`,
    floors: i % 3 === 0 ? 1 : 2,
    bedrooms: 2 + (i % 2),
    bathrooms: 1 + (i % 2),
    material: 'Брус 150x100',
    insulation: 'Минвата 150мм',
    roofing: 'Металлочерепица',
    buildingTime: '4–6 недель',
  },
  images: [`/images/projects/project-${(i % 3) + 1}.jpg`],
  floorPlans: [],
  category: ['frame', 'cottage', 'one-story', 'two-story', 'with-mansard', 'finnish'][i % 6],
  style: ['finnish', 'canadian', 'modern', 'barnhouse'][i % 4],
  features: i % 2 === 0 ? ['terrace'] : ['terrace', 'sauna'],
  rating: Math.round((4.5 + (i % 5) * 0.1) * 10) / 10,
  reviewCount: 5 + i * 2,
  isPopular: i < 4,
  isNew: i === 4 || i === 8,
  createdAt: new Date(2025, i % 12, 1).toISOString(),
  updatedAt: new Date(2026, 1, 1).toISOString(),
}))

const filtersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(12),
  sortBy: z.enum(['popular', 'price-asc', 'price-desc', 'area-asc', 'area-desc']).optional(),
  category: z.string().optional(),
  areaMin: z.coerce.number().optional(),
  areaMax: z.coerce.number().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
})

// GET /api/projects
router.get('/', (req: Request, res: Response) => {
  const filters = filtersSchema.parse(req.query)

  let projects = [...MOCK_PROJECTS]

  // Apply filters
  if (filters.category) projects = projects.filter((p) => p.category === filters.category)
  if (filters.areaMin) projects = projects.filter((p) => p.characteristics.area >= filters.areaMin!)
  if (filters.areaMax) projects = projects.filter((p) => p.characteristics.area <= filters.areaMax!)
  if (filters.priceMin) projects = projects.filter((p) => p.price.basePrice >= filters.priceMin!)
  if (filters.priceMax) projects = projects.filter((p) => p.price.basePrice <= filters.priceMax!)

  // Sort
  if (filters.sortBy === 'price-asc') projects.sort((a, b) => a.price.basePrice - b.price.basePrice)
  else if (filters.sortBy === 'price-desc') projects.sort((a, b) => b.price.basePrice - a.price.basePrice)
  else if (filters.sortBy === 'area-asc') projects.sort((a, b) => a.characteristics.area - b.characteristics.area)
  else if (filters.sortBy === 'area-desc') projects.sort((a, b) => b.characteristics.area - a.characteristics.area)
  else projects.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))

  // Paginate
  const total = projects.length
  const start = (filters.page - 1) * filters.pageSize
  const data = projects.slice(start, start + filters.pageSize)

  const response: PaginatedResponse<Project> = {
    data,
    total,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages: Math.ceil(total / filters.pageSize),
  }

  res.json(response)
})

// GET /api/projects/:id
router.get('/:id', (req: Request, res: Response) => {
  const project = MOCK_PROJECTS.find((p) => p.id === req.params.id || p.slug === req.params.id)
  if (!project) throw new AppError('Project not found', 404)
  res.json({ data: project })
})

// GET /api/projects/:id/similar
router.get('/:id/similar', (req: Request, res: Response) => {
  const project = MOCK_PROJECTS.find((p) => p.id === req.params.id)
  if (!project) throw new AppError('Project not found', 404)

  const similar = MOCK_PROJECTS
    .filter((p) => p.id !== project.id && (p.category === project.category || p.style === project.style))
    .slice(0, 4)

  res.json({ data: similar })
})

export default router
