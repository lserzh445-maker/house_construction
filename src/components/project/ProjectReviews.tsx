import React, { useState } from 'react'
import { ThumbsUp, User } from 'lucide-react'
import { formatDate } from '@/utils/formatPrice'
import type { ProjectReview } from '@/types'

interface ProjectReviewsProps {
  reviews: ProjectReview[]
  projectName: string
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex" aria-label={`Рейтинг ${rating} из 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
      ))}
    </div>
  )
}

export default function ProjectReviews({ reviews, projectName }: ProjectReviewsProps) {
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 4
  const total = reviews.length
  const visible = reviews.slice(0, page * PAGE_SIZE)

  if (total === 0) return null

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)

  return (
    <section aria-labelledby="reviews-title">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 id="reviews-title" className="section-title mb-1">Отзывы о проекте</h2>
          <div className="flex items-center gap-3">
            <StarRating rating={Math.round(Number(avg))} />
            <span className="text-sm text-gray-500">
              {avg} из 5 · {total} {total === 1 ? 'отзыв' : total < 5 ? 'отзыва' : 'отзывов'}
            </span>
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4 mb-6">
        {visible.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#1B5E20]/10 flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-[#1B5E20]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-semibold text-gray-800">{review.author}</span>
                  <time className="text-xs text-gray-400" dateTime={review.date}>
                    {formatDate(review.date)}
                  </time>
                </div>
                <StarRating rating={review.rating} />
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.text}</p>

            {/* YouTube embed if present */}
            {review.videoUrl && (
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
                <iframe
                  src={review.videoUrl}
                  title={`Видеоотзыв — ${review.author}`}
                  className="w-full h-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}

            {/* Helpful */}
            {review.helpful !== undefined && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <ThumbsUp size={13} />
                <span>Полезно ({review.helpful})</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load more */}
      {visible.length < total && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="btn-outline text-sm px-5 py-2.5 min-h-0 h-10"
        >
          Показать ещё ({total - visible.length})
        </button>
      )}
    </section>
  )
}
