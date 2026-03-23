// ─── Domain models ────────────────────────────────────────────────────────────

export interface Project {
  id: string
  name: string
  slug: string
  description: string
  price: {
    basePrice: number
    withFinishing: number
    turnkey: number
  }
  characteristics: {
    area: number
    size: string
    floors: number
    bedrooms: number
    bathrooms: number
    material: string
    insulation: string
    roofing: string
    buildingTime: string
  }
  images: string[]
  floorPlans: string[]
  videoUrl?: string
  category: string   // frame | one-story | two-story | with-mansard | finnish | canadian
  style: string      // finnish | canadian | modern | barnhouse
  features: string[] // terrace | sauna | garage | balcony | boiler-room
  rating?: number
  reviewCount?: number
  isPopular?: boolean
  isNew?: boolean
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  projectId?: string
  author: string
  rating: number
  text: string
  date: string
  videoUrl?: string
  helpful: number
  isApproved: boolean
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  publishedAt: string
  author: string
  category: string
  readTime: number
  tags: string[]
  metaDescription?: string
}

// ─── Lead / Form submissions ──────────────────────────────────────────────────

export interface ContactLead {
  id: string
  type: 'call' | 'quote' | 'consultation' | 'custom-project'
  name: string
  phone: string
  email?: string
  project?: string
  message?: string
  configuration?: string
  createdAt: string
  status: 'new' | 'in-progress' | 'completed'
}

// ─── Calculator ───────────────────────────────────────────────────────────────

export type CompletionType = 'base' | 'finishing' | 'turnkey'

export type CalculatorOption = 'delivery' | 'foundation' | 'utilities' | 'insurance'

export interface PriceBreakdown {
  materials: number
  labor: number
  overhead: number
  options: Record<CalculatorOption, number>
}

export interface CalculatorResult {
  project_id: string | null
  project_name: string
  area: number
  completion_type: CompletionType
  options: CalculatorOption[]
  price_breakdown: PriceBreakdown
  construct_subtotal: number
  options_total: number
  total: number
  price_per_sqm: number
  monthly_payment: number
  mortgage_info: {
    term_years: number
    rate_pct: number
    note: string
  }
}

// ─── API response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    page_size: number
    total_pages: number
    avg_rating?: number
    recommend_pct?: number
  }
}

// ─── Filter/query params ──────────────────────────────────────────────────────

export interface ProjectFilters {
  page?: number
  page_size?: number
  price_from?: number
  price_to?: number
  area_from?: number
  area_to?: number
  floors?: number
  style?: string
  category?: string
  features?: string[]
  sort?: 'popularity' | 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc' | 'newest'
}

export interface ReviewFilters {
  page?: number
  page_size?: number
  project_id?: string
  rating?: number
  sort?: 'newest' | 'oldest' | 'helpful' | 'rating'
}
