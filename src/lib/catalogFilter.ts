import type { Project } from '@/types'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const rawProjects = require('../data/projects.json') as ProjectJson[]

/* ─── JSON shape ─────────────────────────────────────────────────────────── */

interface ProjectJson {
  id: string
  slug: string
  name: string
  description: string
  metaDescription?: string
  price: { base: number; with_finishing: number; turnkey: number }
  area: number
  size: string
  floors: number
  bedrooms: number
  bathrooms: number
  buildingTime: string
  style: string
  category: string
  material: string
  insulation: string
  roofing: string
  features: string[]
  images: string[]
  floorPlans: string[]
  videoUrl: string | null
  rating: number
  reviewCount: number
  isPopular: boolean
  isNew: boolean
  tags: string[]
  reviews: { id: string; author: string; rating: number; text: string; date: string }[]
}

/* ─── Mapping ────────────────────────────────────────────────────────────── */

const STYLE_MAP: Record<string, Project['style']> = {
  финский:    'finnish',
  канадский:  'canadian',
  современный:'modern',
  барнхаус:   'barnhouse',
}

function toProject(p: ProjectJson): Project {
  return {
    id:          p.id,
    slug:        p.slug,
    name:        p.name,
    description: p.description,
    price: {
      basePrice:     p.price.base,
      withFinishing: p.price.with_finishing,
      turnkey:       p.price.turnkey,
    },
    characteristics: {
      area:         p.area,
      size:         p.size,
      floors:       p.floors,
      bedrooms:     p.bedrooms,
      bathrooms:    p.bathrooms,
      material:     p.material,
      insulation:   p.insulation,
      roofing:      p.roofing,
      buildingTime: p.buildingTime,
    },
    images:      p.images,
    floorPlans:  p.floorPlans,
    videoUrl:    p.videoUrl,
    category:    p.category as Project['category'],
    style:       STYLE_MAP[p.style] ?? 'modern',
    features:    p.features,
    rating:      p.rating,
    reviewCount: p.reviewCount,
    isPopular:   p.isPopular,
    isNew:       p.isNew,
  }
}

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface CatalogParams {
  floors?:     string   // '1' | '2' | 'mansard'
  area_from?:  number
  area_to?:    number
  price_from?: number
  price_to?:   number
  style?:      string[]
  features?:   string[]
  sort?:       string
  page?:       number
  page_size?:  number
}

export interface CatalogResult {
  data:       Project[]
  total:      number
  page:       number
  pageSize:   number
  totalPages: number
}

/* ─── Filter / sort / paginate ───────────────────────────────────────────── */

export function filterCatalog(params: CatalogParams = {}): CatalogResult {
  let projects = rawProjects.map(toProject)

  if (params.floors !== undefined) {
    if (params.floors === 'mansard') {
      projects = projects.filter((p) => p.category === 'with-mansard')
    } else {
      const f = Number(params.floors)
      projects = projects.filter(
        (p) => p.characteristics.floors === f && p.category !== 'with-mansard',
      )
    }
  }

  if (params.area_from)  projects = projects.filter((p) => p.characteristics.area >= params.area_from!)
  if (params.area_to)    projects = projects.filter((p) => p.characteristics.area <= params.area_to!)
  if (params.price_from) projects = projects.filter((p) => p.price.basePrice >= params.price_from!)
  if (params.price_to)   projects = projects.filter((p) => p.price.basePrice <= params.price_to!)

  if (params.style?.length) {
    projects = projects.filter((p) => params.style!.includes(p.style))
  }

  if (params.features?.length) {
    projects = projects.filter((p) => params.features!.every((f) => p.features.includes(f)))
  }

  switch (params.sort) {
    case 'price_asc':  projects.sort((a, b) => a.price.basePrice - b.price.basePrice); break
    case 'price_desc': projects.sort((a, b) => b.price.basePrice - a.price.basePrice); break
    case 'area_asc':   projects.sort((a, b) => a.characteristics.area - b.characteristics.area); break
    case 'area_desc':  projects.sort((a, b) => b.characteristics.area - a.characteristics.area); break
    default:
      projects.sort((a, b) => {
        if (a.isPopular !== b.isPopular) return a.isPopular ? -1 : 1
        return (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
      })
  }

  const total      = projects.length
  const page       = Math.max(1, params.page ?? 1)
  const pageSize   = Math.min(50, Math.max(1, params.page_size ?? 12))
  const data       = projects.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(total / pageSize)

  return { data, total, page, pageSize, totalPages }
}

/* ─── URL query string builder ───────────────────────────────────────────── */

export function buildCatalogUrl(params: CatalogParams): string {
  const q = new URLSearchParams()
  if (params.floors)                q.set('floors',     params.floors)
  if (params.area_from)             q.set('area_from',  String(params.area_from))
  if (params.area_to)               q.set('area_to',    String(params.area_to))
  if (params.price_from)            q.set('price_from', String(params.price_from))
  if (params.price_to)              q.set('price_to',   String(params.price_to))
  if (params.style?.length)         q.set('style',      params.style.join(','))
  if (params.features?.length)      q.set('features',   params.features.join(','))
  if (params.sort)                  q.set('sort',       params.sort)
  if (params.page && params.page > 1) q.set('page',     String(params.page))
  if (params.page_size)             q.set('page_size',  String(params.page_size))
  const qs = q.toString()
  return `/api/catalog${qs ? `?${qs}` : ''}`
}
