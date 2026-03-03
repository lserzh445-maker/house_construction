import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, A11y } from 'swiper/modules'
import { ThumbsUp, Play } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/utils/formatPrice'
import { fadeInUp, stagger, viewport } from '@/lib/animations'
import type { Review } from '@/types'
import styles from './ReviewsCarousel.module.css'

import 'swiper/css'
import 'swiper/css/pagination'

/* ─── Props ──────────────────────────────────────────────────────────── */
export interface ReviewsCarouselProps {
  reviews?: Review[]
  avgRating?: number
  totalCount?: number
  className?: string
}

/* ─── Mock data ──────────────────────────────────────────────────────── */
const DEFAULT_REVIEWS: Review[] = [
  {
    id: '1', author: 'Иван Петров', rating: 5, date: '2026-01-15',
    projectId: 'fin-d5', projectName: 'Финский дом Д-5',
    text: 'Отличный дом! Построили за 5 недель, всё строго по договору. Качество материалов на высшем уровне. Уже прошла первая зима — дом тёплый, расходы на отопление минимальные. Всем рекомендую!',
    helpful: 24, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '2', author: 'Мария Сидорова', rating: 5, date: '2025-12-20',
    projectId: 'barn-b3', projectName: 'Барнхаус Б-3',
    text: 'Очень довольна результатом. Менеджер всегда был на связи, присылал фото каждые 2–3 дня. Никаких скрытых доплат — всё по смете. Дом превзошёл все ожидания по качеству отделки.',
    helpful: 18,
  },
  {
    id: '3', author: 'Алексей Козлов', rating: 5, date: '2025-11-05',
    projectId: 'canadian-k2', projectName: 'Канадский К-2',
    text: 'Строили дом в ноябре — никаких проблем с зимним строительством. Бригада профессиональная, работают слаженно. Сдали на 3 дня раньше срока. Гарантийный паспорт получили при сдаче.',
    helpful: 31,
  },
  {
    id: '4', author: 'Ольга Новикова', rating: 4, date: '2025-10-12',
    text: 'В целом очень доволен. Небольшие задержки на этапе инженерных систем, но команда оперативно решила все вопросы. Дом тёплый и красивый. Взяли ипотеку через их партнёра — одобрили быстро.',
    helpful: 11,
  },
  {
    id: '5', author: 'Дмитрий Соколов', rating: 5, date: '2025-09-28',
    projectId: 'modern-m1', projectName: 'Современный М-1',
    text: 'Второй год живём в доме — всё отлично. Зимой тепло при минус 25, летом не жарко. Отделка держится, ничего не трескается и не расходится. Буду рекомендовать всем знакомым.',
    helpful: 42, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
]

/* ─── Star Rating ────────────────────────────────────────────────────── */
function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'text-2xl' : 'text-base'
  return (
    <span className={`${styles.stars} ${cls}`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

/* ─── Review Card ────────────────────────────────────────────────────── */
function ReviewCard({ review }: { review: Review }) {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
            {review.author[0]}
          </div>
          <div>
            <p className="font-semibold text-neutral-dark text-sm">{review.author}</p>
            {review.projectName && (
              <p className="text-xs text-neutral-medium">Проект: {review.projectName}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <Stars rating={review.rating} />
          <p className="text-xs text-neutral-medium mt-0.5">{formatDate(review.date)}</p>
        </div>
      </div>

      {/* Text */}
      <p className="text-neutral-medium text-sm leading-relaxed mb-4 flex-1 line-clamp-5">
        {review.text}
      </p>

      {/* Video */}
      {review.videoUrl && (
        <div className="mb-4">
          {!showVideo ? (
            <button
              onClick={() => setShowVideo(true)}
              className={`w-full aspect-video bg-neutral-light rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-primary hover:bg-primary-50 transition-colors ${styles.videoThumb}`}
            >
              <Play size={20} />
              Видеоотзыв
            </button>
          ) : (
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                src={`${review.videoUrl}?autoplay=1`}
                title={`Видеоотзыв — ${review.author}`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <Badge variant="success" className="text-[11px]">Проверенный отзыв</Badge>
        <button className="flex items-center gap-1.5 text-xs text-neutral-medium hover:text-primary transition-colors">
          <ThumbsUp size={13} />
          Полезно ({review.helpful})
        </button>
      </div>
    </div>
  )
}

/* ─── Summary Bar ────────────────────────────────────────────────────── */
function RatingSummary({ avg, total }: { avg: number; total: number }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 bg-primary-50 rounded-2xl p-6 mb-8">
      <div className="text-center">
        <p className="font-heading font-bold text-5xl text-primary">{avg.toFixed(1)}</p>
        <Stars rating={Math.round(avg)} size="lg" />
        <p className="text-sm text-neutral-medium mt-1">{total} отзывов</p>
      </div>
      <div className="flex-1 w-full">
        {[5, 4, 3, 2, 1].map((star) => {
          const pct = star === 5 ? 75 : star === 4 ? 18 : star === 3 ? 5 : star === 2 ? 1 : 1
          return (
            <div key={star} className="flex items-center gap-3 mb-1.5">
              <span className="text-xs text-neutral-medium w-4">{star}</span>
              <span className="text-yellow-400 text-xs">★</span>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={viewport}
                  transition={{ duration: 0.8, delay: (5 - star) * 0.08 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
              <span className="text-xs text-neutral-medium w-8 text-right">{pct}%</span>
            </div>
          )
        })}
      </div>
      <div className="text-center sm:text-right">
        <p className="text-2xl font-bold text-primary font-heading">98%</p>
        <p className="text-sm text-neutral-medium">рекомендуют</p>
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function ReviewsCarousel({
  reviews,
  avgRating = 4.8,
  totalCount = 150,
  className = '',
}: ReviewsCarouselProps) {
  const data = reviews ?? DEFAULT_REVIEWS

  return (
    <section className={`section-padding bg-neutral-light ${className}`} aria-labelledby="reviews-title">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-8"
        >
          <motion.span variants={fadeInUp} className="text-accent font-semibold text-sm uppercase tracking-widest">
            Отзывы клиентов
          </motion.span>
          <motion.h2 variants={fadeInUp} id="reviews-title" className="section-title mt-1">
            Что говорят наши клиенты
          </motion.h2>
          <motion.p variants={fadeInUp} className="section-subtitle mx-auto">
            Реальные истории семей, которые уже живут в наших домах
          </motion.p>
        </motion.div>

        {/* Rating summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6 }}
        >
          <RatingSummary avg={avgRating} total={totalCount} />
        </motion.div>

        {/* Swiper */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={styles.wrap}
        >
          <Swiper
            modules={[Pagination, Autoplay, A11y]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              768:  { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            a11y={{
              prevSlideMessage: 'Предыдущий отзыв',
              nextSlideMessage: 'Следующий отзыв',
            }}
          >
            {data.map((review) => (
              <SwiperSlide key={review.id} className="h-auto">
                <ReviewCard review={review} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Link */}
        <div className="text-center mt-6">
          <a href="/reviews" className="btn-outline">
            Читать все отзывы
          </a>
        </div>
      </div>
    </section>
  )
}
