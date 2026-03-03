import React, { useState, useCallback } from 'react'
import { GetServerSideProps } from 'next'
import { SlidersHorizontal, X, Home } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import ProductCard from '@/components/catalog/ProductCard'
import FilterPanel from '@/components/catalog/FilterPanel'
import type { Project, FilterState } from '@/types'

// Mock data — replace with real API call
const MOCK_PROJECTS: Project[] = Array.from({ length: 12 }, (_, i) => ({
  id: `project-${i + 1}`,
  name: ['Финский дом Ф-1', 'Барнхаус Б-2', 'Современный С-3', 'Канадский К-4', 'Коттедж К-5', 'Одноэтажный О-1'][i % 6] + (i > 5 ? ' Plus' : ''),
  slug: `project-${i + 1}`,
  description: 'Просторный и комфортный каркасный дом с продуманной планировкой.',
  price: {
    basePrice: 4500000 + i * 800000,
    withFinishing: 5400000 + i * 960000,
    turnkey: 6300000 + i * 1120000,
  },
  characteristics: {
    area: 55 + i * 10,
    size: `${6 + (i % 4)}x${7 + (i % 3)}`,
    floors: (i % 3 === 0) ? 1 : 2,
    bedrooms: 2 + (i % 2),
    bathrooms: 1 + (i % 2),
    material: 'Брус 150x100',
    insulation: 'Минвата 150мм',
    roofing: 'Металлочерепица',
    buildingTime: '4–6 недель',
  },
  images: [`/images/projects/project-${(i % 3) + 1}.jpg`],
  floorPlans: [],
  category: ['frame', 'cottage', 'one-story', 'two-story', 'with-mansard', 'finnish'][i % 6] as Project['category'],
  style: ['finnish', 'canadian', 'modern', 'barnhouse'][i % 4] as Project['style'],
  features: i % 2 === 0 ? ['terrace'] : ['terrace', 'sauna'],
  rating: 4.5 + (i % 5) * 0.1,
  reviewCount: 5 + i * 3,
  isPopular: i < 3,
  isNew: i === 3 || i === 7,
}))

interface CatalogProps {
  initialProjects: Project[]
  total: number
}

export default function CatalogPage({ initialProjects, total }: CatalogProps) {
  const [filters, setFilters] = useState<FilterState>({})
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    // In production: update URL params and fetch from API
  }, [])

  const handleReset = useCallback(() => setFilters({}), [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <Layout
      title="Каталог каркасных домов — проекты и цены"
      description="Каталог каркасных домов: одноэтажные, двухэтажные, с мансардой, финские, канадские. Фильтрация по площади, цене и стилю."
      canonical="/catalog"
    >
      {/* Breadcrumb */}
      <div className="bg-neutral-light border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-neutral-medium">
            <a href="/" className="hover:text-primary">Главная</a>
            <span className="mx-2">›</span>
            <span className="text-neutral-dark font-medium">Каталог</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title mb-1">Каталог каркасных домов</h1>
            <p className="text-neutral-medium text-sm">Найдено: {total} проектов</p>
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 btn-outline text-sm px-4 py-2 min-h-0 h-10"
          >
            <SlidersHorizontal size={16} />
            Фильтры
          </button>
        </div>

        <div className="flex gap-6">
          {/* Desktop FilterPanel */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleReset} />
          </div>

          {/* Mobile FilterPanel overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-semibold text-lg">Фильтры</h2>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X size={24} />
                  </button>
                </div>
                <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleReset} />
                <button onClick={() => setShowMobileFilters(false)} className="btn-primary w-full mt-4">
                  Показать результаты
                </button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {initialProjects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {initialProjects.map((project) => (
                    <ProductCard
                      key={project.id}
                      project={project}
                      isFavorite={favorites.has(project.id)}
                      onFavoriteToggle={toggleFavorite}
                    />
                  ))}
                </div>
                {/* Pagination placeholder */}
                <div className="flex justify-center mt-10 gap-2">
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                        page === 1
                          ? 'bg-primary text-white'
                          : 'border border-gray-200 text-neutral-dark hover:border-primary hover:text-primary'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-neutral-medium">
                <Home size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Проекты не найдены</p>
                <p className="text-sm">Попробуйте изменить параметры фильтра</p>
                <button onClick={handleReset} className="btn-outline mt-4">
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<CatalogProps> = async () => {
  // TODO: replace with real API call: await projectsApi.getAll(query)
  return {
    props: {
      initialProjects: MOCK_PROJECTS,
      total: MOCK_PROJECTS.length,
    },
  }
}
