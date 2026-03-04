import React, { useCallback } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { SlidersHorizontal, X, Home, ChevronLeft, ChevronRight } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import ProductCard from '@/components/catalog/ProductCard'
import FilterPanel from '@/components/catalog/FilterPanel'
import CompareBar from '@/components/catalog/CompareBar'
import { useCatalog } from '@/hooks/useCatalog'
import { filterCatalog } from '@/lib/catalogFilter'
import type { CatalogParams, CatalogResult } from '@/lib/catalogFilter'
import { cn } from '@/utils/cn'

/* ─── Sort options ───────────────────────────────────────────────────────── */

const SORT_OPTIONS = [
  { value: 'popularity', label: 'По популярности' },
  { value: 'price_asc',  label: 'Цена: сначала дешевле' },
  { value: 'price_desc', label: 'Цена: сначала дороже' },
  { value: 'area_asc',   label: 'Площадь: по возрастанию' },
  { value: 'area_desc',  label: 'Площадь: по убыванию' },
]

/* ─── URL ↔ params helpers ───────────────────────────────────────────────── */

function parseParams(query: Record<string, string | string[] | undefined>): CatalogParams {
  const str = (k: string) => (typeof query[k] === 'string' ? (query[k] as string) : undefined)
  const num = (k: string) => (str(k) ? Number(str(k)) : undefined)

  return {
    floors:     str('floors'),
    area_from:  num('area_from'),
    area_to:    num('area_to'),
    price_from: num('price_from'),
    price_to:   num('price_to'),
    style:      str('style')?.split(',').filter(Boolean),
    features:   str('features')?.split(',').filter(Boolean),
    sort:       str('sort'),
    page:       num('page'),
  }
}

function paramsToQuery(p: CatalogParams): Record<string, string> {
  const q: Record<string, string> = {}
  if (p.floors)              q.floors     = p.floors
  if (p.area_from)           q.area_from  = String(p.area_from)
  if (p.area_to)             q.area_to    = String(p.area_to)
  if (p.price_from)          q.price_from = String(p.price_from)
  if (p.price_to)            q.price_to   = String(p.price_to)
  if (p.style?.length)       q.style      = p.style.join(',')
  if (p.features?.length)    q.features   = p.features.join(',')
  if (p.sort)                q.sort       = p.sort
  if (p.page && p.page > 1)  q.page       = String(p.page)
  return q
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

interface CatalogPageProps {
  fallbackData: CatalogResult
}

export default function CatalogPage({ fallbackData }: CatalogPageProps) {
  const router = useRouter()
  const [showMobileFilters, setShowMobileFilters] = React.useState(false)

  const params  = parseParams(router.query)
  const { data, isLoading } = useCatalog(params, fallbackData)

  const { data: projects = [], total = 0, page = 1, totalPages = 1 } = data ?? {}

  /* ── URL update ─────────────────────────────────────────────────────────── */
  const pushParams = useCallback(
    (next: CatalogParams) => {
      router.push(
        { pathname: '/catalog', query: paramsToQuery(next) },
        undefined,
        { shallow: true, scroll: false },
      )
    },
    [router],
  )

  const handleFilterChange = useCallback(
    (partial: Partial<CatalogParams>) => {
      pushParams({ ...params, ...partial })
    },
    [params, pushParams],
  )

  const handleReset = useCallback(() => {
    router.push({ pathname: '/catalog' }, undefined, { shallow: true })
  }, [router])

  const handleSort = useCallback(
    (sort: string) => pushParams({ ...params, sort, page: undefined }),
    [params, pushParams],
  )

  const handlePage = useCallback(
    (p: number) => {
      pushParams({ ...params, page: p > 1 ? p : undefined })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [params, pushParams],
  )

  /* ── Pagination range ───────────────────────────────────────────────────── */
  const pageRange = (() => {
    const delta = 2
    const range: (number | '…')[] = []
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= delta) {
        range.push(i)
      } else if (range[range.length - 1] !== '…') {
        range.push('…')
      }
    }
    return range
  })()

  /* ── Render ─────────────────────────────────────────────────────────────── */
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
            <a href="/" className="hover:text-primary transition-colors">Главная</a>
            <span className="mx-2">›</span>
            <span className="text-neutral-dark font-medium">Каталог</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pb-28">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="section-title mb-1">Каталог каркасных домов</h1>
            <p className="text-neutral-medium text-sm">
              {isLoading ? 'Загрузка...' : `Найдено: ${total} проектов`}
            </p>
          </div>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 btn-outline text-sm px-4 py-2 min-h-0 h-10 shrink-0"
          >
            <SlidersHorizontal size={16} />
            Фильтры
          </button>
        </div>

        <div className="flex gap-6">
          {/* ── Desktop filter sidebar ──────────────────────────────────── */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                params={params}
                onChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>
          </div>

          {/* ── Mobile filter drawer ────────────────────────────────────── */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowMobileFilters(false)}
              />
              <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-heading font-semibold text-lg">Фильтры</h2>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div className="p-4">
                  <FilterPanel
                    params={params}
                    onChange={(p) => { handleFilterChange(p); setShowMobileFilters(false) }}
                    onReset={() => { handleReset(); setShowMobileFilters(false) }}
                  />
                </div>
                <div className="p-4 border-t">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="btn-primary w-full"
                  >
                    Показать {total} проектов
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Main content ────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5 gap-3">
              <p className="text-sm text-neutral-medium hidden sm:block">
                {total} {total === 1 ? 'проект' : total < 5 ? 'проекта' : 'проектов'}
              </p>
              <select
                value={params.sort ?? 'popularity'}
                onChange={(e) => handleSort(e.target.value)}
                className="input-field text-sm py-2 min-h-0 h-10 w-full sm:w-auto sm:min-w-[220px]"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Grid */}
            {projects.length > 0 ? (
              <>
                <div
                  className={cn(
                    'grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
                    isLoading && 'opacity-60 pointer-events-none transition-opacity',
                  )}
                >
                  {projects.map((project) => (
                    <ProductCard key={project.id} project={project} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav
                    className="flex justify-center items-center mt-10 gap-1"
                    aria-label="Пагинация"
                  >
                    <button
                      onClick={() => handlePage(page - 1)}
                      disabled={page <= 1}
                      className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200
                                 text-neutral-dark hover:border-primary hover:text-primary transition-colors
                                 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Предыдущая страница"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {pageRange.map((item, idx) =>
                      item === '…' ? (
                        <span key={`ellipsis-${idx}`} className="w-10 text-center text-neutral-medium">
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => handlePage(item as number)}
                          className={cn(
                            'w-10 h-10 rounded-lg font-medium text-sm transition-colors',
                            item === page
                              ? 'bg-primary text-white'
                              : 'border border-gray-200 text-neutral-dark hover:border-primary hover:text-primary',
                          )}
                          aria-current={item === page ? 'page' : undefined}
                        >
                          {item}
                        </button>
                      ),
                    )}

                    <button
                      onClick={() => handlePage(page + 1)}
                      disabled={page >= totalPages}
                      className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200
                                 text-neutral-dark hover:border-primary hover:text-primary transition-colors
                                 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Следующая страница"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-neutral-medium">
                <Home size={52} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Проекты не найдены</p>
                <p className="text-sm mb-6">Попробуйте изменить параметры фильтра</p>
                <button onClick={handleReset} className="btn-outline">
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compare bar (fixed bottom) */}
      <CompareBar />
    </Layout>
  )
}

/* ─── SSR ────────────────────────────────────────────────────────────────── */

export const getServerSideProps: GetServerSideProps<CatalogPageProps> = async ({ query }) => {
  const params = parseParams(query as Record<string, string | string[] | undefined>)
  const fallbackData = filterCatalog(params)
  return { props: { fallbackData } }
}
