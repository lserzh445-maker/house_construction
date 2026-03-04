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
  videoUrl?: string | null
  category: 'frame' | 'cottage' | 'one-story' | 'two-story' | 'with-mansard' | 'finnish'
  style: 'finnish' | 'canadian' | 'modern' | 'barnhouse'
  features: string[]
  rating?: number
  reviewCount?: number
  isPopular?: boolean
  isNew?: boolean
  createdAt?: string
}

export interface Review {
  id: string
  author: string
  projectId?: string
  projectName?: string
  rating: number
  text: string
  date: string
  videoUrl?: string
  helpful: number
  avatar?: string
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
}

export interface ContactFormData {
  name: string
  phone: string
  project?: string
  consent: boolean
}

export interface QuoteFormData {
  name: string
  email: string
  phone: string
  project: string
  configuration: 'without-finishing' | 'with-finishing' | 'turnkey'
  consent: boolean
}

export interface ConsultationFormData {
  name: string
  phone: string
  email?: string
  date: string
  place: 'office' | 'exhibition'
  topic?: string
  consent: boolean
}

export interface CustomProjectFormData {
  name: string
  phone: string
  email: string
  area?: number
  rooms?: number
  requirements?: string
  consent: boolean
}

export interface FilterState {
  floors?: number[]
  areaMin?: number
  areaMax?: number
  priceMin?: number
  priceMax?: number
  style?: string[]
  configuration?: string[]
  features?: string[]
  sortBy?: 'popular' | 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc'
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface Benefit {
  icon: string
  title: string
  description: string
}

export interface OrderStep {
  step: number
  title: string
  description: string
}

export interface BankPartner {
  name: string
  logo: string
  rate: string
  url: string
}
