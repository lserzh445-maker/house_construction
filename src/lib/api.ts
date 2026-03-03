import axios from 'axios'
import type { FilterState } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const projectsApi = {
  getAll: (filters?: Partial<FilterState> & { page?: number; pageSize?: number }) =>
    api.get('/api/projects', { params: filters }),
  getById: (id: string) =>
    api.get(`/api/projects/${id}`),
  getSimilar: (id: string) =>
    api.get(`/api/projects/${id}/similar`),
  getPopular: () =>
    api.get('/api/projects?sortBy=popular&pageSize=6'),
}

export const contactsApi = {
  submitCall: (data: unknown) =>
    api.post('/api/contacts/call', data),
  submitQuote: (data: unknown) =>
    api.post('/api/contacts/quote', data),
  submitConsultation: (data: unknown) =>
    api.post('/api/contacts/consultation', data),
  submitCustomProject: (data: unknown) =>
    api.post('/api/contacts/custom-project', data),
}

export const reviewsApi = {
  getAll: (params?: { page?: number; rating?: number; sortBy?: string }) =>
    api.get('/api/reviews', { params }),
  getByProject: (projectId: string) =>
    api.get(`/api/reviews/project/${projectId}`),
}

export const blogApi = {
  getAll: (params?: { page?: number; category?: string }) =>
    api.get('/api/blog', { params }),
  getBySlug: (slug: string) =>
    api.get(`/api/blog/${slug}`),
  getRecent: (count = 3) =>
    api.get(`/api/blog?pageSize=${count}&sortBy=latest`),
}

export const calculatorApi = {
  calculate: (data: unknown) =>
    api.post('/api/calculator/calculate', data),
}
