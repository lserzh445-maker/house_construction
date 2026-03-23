/**
 * Repository layer — mimics PrismaClient API.
 *
 * When a real database is ready:
 * 1. Install @prisma/client and run `npx prisma generate`
 * 2. Replace the mock implementations below with real Prisma queries, e.g.:
 *    return prisma.project.findMany({ where, orderBy, skip, take })
 */

import { PROJECTS, REVIEWS } from './mockData'
import { v4 as uuidv4 } from 'uuid'
import type { Project, Review, ContactLead } from '../types'

// In-memory lead store — replace with prisma.lead.create(...)
const _leads: ContactLead[] = []

// ─── Project filters ──────────────────────────────────────────────────────────

export interface ProjectQuery {
  // Filtering
  style?: string
  category?: string
  floors?: number
  price_from?: number
  price_to?: number
  area_from?: number
  area_to?: number
  features?: string[]
  is_popular?: boolean
  // Sorting: popularity | price_asc | price_desc | area_asc | area_desc
  sort?: string
  // Pagination
  page: number
  page_size: number
}

// ─── Review filters ───────────────────────────────────────────────────────────

export interface ReviewQuery {
  project_id?: string
  rating?: number
  // Sorting: newest | oldest | helpful | rating
  sort?: string
  page: number
  page_size: number
}

// ─── Lead create ──────────────────────────────────────────────────────────────

export interface CreateLeadInput {
  type: ContactLead['type']
  name: string
  phone: string
  email?: string
  project_id?: string
  message?: string
  completion_type?: string
}

// ─── Projects repository ──────────────────────────────────────────────────────

export const projectsRepo = {
  /**
   * Prisma equivalent:
   * prisma.project.findMany({ where, orderBy, skip, take })
   */
  async findMany(q: ProjectQuery): Promise<{ data: Project[]; total: number }> {
    let rows = [...PROJECTS]

    // Filter
    if (q.style)      rows = rows.filter((p) => p.style === q.style)
    if (q.category)   rows = rows.filter((p) => p.category === q.category)
    if (q.floors)     rows = rows.filter((p) => p.characteristics.floors === q.floors)
    if (q.price_from) rows = rows.filter((p) => p.price.basePrice >= q.price_from!)
    if (q.price_to)   rows = rows.filter((p) => p.price.basePrice <= q.price_to!)
    if (q.area_from)  rows = rows.filter((p) => p.characteristics.area >= q.area_from!)
    if (q.area_to)    rows = rows.filter((p) => p.characteristics.area <= q.area_to!)
    if (q.is_popular) rows = rows.filter((p) => p.isPopular)
    if (q.features?.length) {
      rows = rows.filter((p) => q.features!.every((f) => p.features.includes(f)))
    }

    // Sort
    switch (q.sort) {
      case 'price_asc':    rows.sort((a, b) => a.price.basePrice - b.price.basePrice); break
      case 'price_desc':   rows.sort((a, b) => b.price.basePrice - a.price.basePrice); break
      case 'area_asc':     rows.sort((a, b) => a.characteristics.area - b.characteristics.area); break
      case 'area_desc':    rows.sort((a, b) => b.characteristics.area - a.characteristics.area); break
      case 'newest':       rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break
      default:             // popularity
        rows.sort((a, b) => {
          if (a.isPopular !== b.isPopular) return a.isPopular ? -1 : 1
          return (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
        })
    }

    const total = rows.length
    const skip  = (q.page - 1) * q.page_size
    return { data: rows.slice(skip, skip + q.page_size), total }
  },

  /**
   * Prisma equivalent:
   * prisma.project.findUnique({ where: { id } })
   *   ?? prisma.project.findUnique({ where: { slug: id } })
   */
  async findUnique(idOrSlug: string): Promise<Project | null> {
    return PROJECTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null
  },

  /**
   * Prisma equivalent:
   * prisma.project.findMany({
   *   where: { id: { not: project.id }, OR: [{ category }, { style }] },
   *   take: limit,
   * })
   */
  async findSimilar(project: Project, limit = 4): Promise<Project[]> {
    return PROJECTS
      .filter(
        (p) =>
          p.id !== project.id &&
          (p.category === project.category || p.style === project.style),
      )
      .slice(0, limit)
  },
}

// ─── Reviews repository ───────────────────────────────────────────────────────

export const reviewsRepo = {
  /**
   * Prisma equivalent:
   * prisma.review.findMany({ where: { isApproved: true, ...filters }, orderBy, skip, take })
   */
  async findMany(q: ReviewQuery): Promise<{ data: Review[]; total: number; avgRating: number }> {
    let rows = REVIEWS.filter((r) => r.isApproved)

    if (q.project_id) rows = rows.filter((r) => r.projectId === q.project_id)
    if (q.rating)     rows = rows.filter((r) => r.rating === q.rating)

    switch (q.sort) {
      case 'oldest':  rows.sort((a, b) => a.date.localeCompare(b.date)); break
      case 'helpful': rows.sort((a, b) => b.helpful - a.helpful); break
      case 'rating':  rows.sort((a, b) => b.rating - a.rating); break
      default:        rows.sort((a, b) => b.date.localeCompare(a.date)) // newest
    }

    const avgRating = rows.length
      ? rows.reduce((s, r) => s + r.rating, 0) / rows.length
      : 0

    const total = rows.length
    const skip  = (q.page - 1) * q.page_size
    return { data: rows.slice(skip, skip + q.page_size), total, avgRating }
  },
}

// ─── Leads repository ─────────────────────────────────────────────────────────

export const leadsRepo = {
  /**
   * Prisma equivalent:
   * prisma.lead.create({ data: { ...input, status: 'NEW' } })
   */
  async create(input: CreateLeadInput): Promise<ContactLead> {
    const lead: ContactLead = {
      id: uuidv4(),
      type: input.type,
      name: input.name,
      phone: input.phone,
      email: input.email,
      project: input.project_id,
      message: input.message,
      configuration: input.completion_type,
      createdAt: new Date().toISOString(),
      status: 'new',
    }
    _leads.push(lead)
    console.log(`[DB] Lead created: ${lead.type} — ${lead.id} — ${lead.name}`)
    return lead
  },

  /** For admin/debug usage */
  findAll(): ContactLead[] {
    return [..._leads]
  },
}
