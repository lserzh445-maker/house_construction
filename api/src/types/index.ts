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
  category: string
  style: string
  features: string[]
  rating?: number
  reviewCount?: number
  isPopular?: boolean
  isNew?: boolean
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  author: string
  projectId?: string
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

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface ProjectFilters extends PaginationParams {
  floors?: number | number[]
  areaMin?: number
  areaMax?: number
  priceMin?: number
  priceMax?: number
  style?: string | string[]
  features?: string | string[]
  sortBy?: 'popular' | 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc'
  category?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
