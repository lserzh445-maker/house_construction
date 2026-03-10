import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import { ThumbsUp } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { formatDate } from '@/utils/formatPrice'
import type { Review } from '@/types'

const MOCK_REVIEWS: Review[] = Array.from({ length: 10 }, (_, i) => ({
  id: `rev-${i + 1}`,
  author: ['Иван Петров', 'Мария Сидорова', 'Алексей Козлов', 'Ольга Новикова', 'Дмитрий Соколов'][i % 5],
  projectId: ['fin-d5', 'modern-m1', 'barn-b3'][i % 3],
  projectName: ['Финский дом Д-5', 'Современный М-1', 'Барнхаус Б-3'][i % 3],
  rating: 5 - (i % 2 === 0 ? 0 : 1),
  text: [
    'Отличный дом! Построили за 5 недель, всё по договору. Качество материалов на высшем уровне, соседи завидуют.',
    'Очень доволен результатом. Чёткая работа, никаких сюрпризов по цене. Рекомендую всем, кто хочет надёжный дом.',
    'Строили дом в зимний период — никаких проблем. Команда профессионалов, менеджер всегда на связи.',
    'Взяли ипотеку через их партнёра, одобрили быстро. Дом сдали точно в срок, внутренняя отделка понравилась.',
    'Сначала сомневались, но результат превзошёл ожидания. Тёплый, тихий, уютный дом. Живём второй год — всё отлично.',
  ][i % 5],
  date: new Date(2025, 11 - (i % 6), 15 - i).toISOString().split('T')[0],
  ...(i < 2 ? { videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' } : {}),
  helpful: 5 + i * 3,
}))

interface ReviewsPageProps {
  reviews: Review[]
  avgRating: number
  total: number
}

export default function ReviewsPage({ reviews, avgRating, total }: ReviewsPageProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'helpful'>('newest')
  const [filterRating, setFilterRating] = useState(0)

  const filtered = reviews
    .filter((r) => filterRating === 0 || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === 'rating') return b.rating - a.rating
      return b.helpful - a.helpful
    })

  return (
    <Layout
      title="Отзывы клиентов о строительстве каркасных домов — ДомСтрой"
      description="Реальные отзывы клиентов о строительстве каркасных домов компанией ДомСтрой. Рейтинг 4.8 из 5, 150+ отзывов."
      canonical="/reviews"
    >
      {/* Header */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl mb-4">Отзывы клиентов</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="text-5xl font-bold font-heading">{avgRating.toFixed(1)}</div>
            <div>
              <div className="flex text-2xl text-yellow-300 mb-1">
                {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
              </div>
              <p className="text-primary-100 text-sm">{total} отзывов · 98% рекомендуют</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-neutral-medium">Рейтинг:</span>
            {[0, 5, 4, 3].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRating(r)}
                className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-colors ${
                  filterRating === r ? 'border-primary bg-primary text-white' : 'border-gray-200 hover:border-primary'
                }`}
              >
                {r === 0 ? 'Все' : '★'.repeat(r)}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input-field text-sm py-2 min-h-0 h-10 w-auto"
          >
            <option value="newest">Новые</option>
            <option value="rating">По рейтингу</option>
            <option value="helpful">Полезные</option>
          </select>
        </div>

        {/* Reviews */}
        <div className="space-y-5">
          {filtered.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary font-bold">
                    {review.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-dark">{review.author}</p>
                    {review.projectName && (
                      <p className="text-xs text-neutral-medium">Проект: {review.projectName}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 text-sm">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className="text-xs text-neutral-medium mt-0.5">{formatDate(review.date)}</p>
                </div>
              </div>

              <p className="text-neutral-medium text-sm leading-relaxed mb-4">{review.text}</p>

              {review.videoUrl && (
                <div className="aspect-video max-w-xs rounded-xl overflow-hidden mb-4 bg-neutral-light">
                  <iframe
                    src={review.videoUrl}
                    title="Видеоотзыв"
                    className="w-full h-full"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              )}

              <button className="flex items-center gap-2 text-sm text-neutral-medium hover:text-primary transition-colors">
                <ThumbsUp size={15} />
                Полезный отзыв ({review.helpful})
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<ReviewsPageProps> = async () => {
  return {
    props: {
      reviews: MOCK_REVIEWS,
      avgRating: 4.8,
      total: MOCK_REVIEWS.length,
    },
  }
}
