import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs, A11y } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { Home, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

interface ProjectGalleryProps {
  images: string[]
  projectName: string
}

export default function ProjectGallery({ images, projectName }: ProjectGalleryProps) {
  const mainRef = useRef<SwiperType | null>(null)
  const fsRef   = useRef<SwiperType | null>(null)
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [fullscreen, setFullscreen]     = useState(false)
  const [imgErrors, setImgErrors]       = useState<Record<number, boolean>>({})

  const onImgError = useCallback((idx: number) => {
    setImgErrors((prev) => ({ ...prev, [idx]: true }))
  }, [])

  const openFullscreen = () => {
    const idx = mainRef.current?.activeIndex ?? 0
    setFullscreen(true)
    // sync fullscreen swiper after it mounts
    setTimeout(() => fsRef.current?.slideTo(idx, 0), 50)
  }

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
        <Home size={64} />
      </div>
    )
  }

  const safeThumbsSwiper = thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null

  return (
    <>
      <div className="space-y-3">
        {/* ── Main Swiper ── */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 group">
          <Swiper
            modules={[Navigation, Thumbs, A11y]}
            onSwiper={(s) => { mainRef.current = s }}
            thumbs={{ swiper: safeThumbsSwiper }}
            a11y={{ prevSlideMessage: 'Предыдущее фото', nextSlideMessage: 'Следующее фото' }}
            className="aspect-[4/3] w-full"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-full">
                  {!imgErrors[idx] ? (
                    <Image
                      src={img}
                      alt={`${projectName} — фото ${idx + 1}`}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      onError={() => onImgError(idx)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-100">
                      <Home size={48} />
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom nav buttons */}
          <button
            onClick={() => mainRef.current?.slidePrev()}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
            aria-label="Предыдущее фото"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => mainRef.current?.slideNext()}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
            aria-label="Следующее фото"
          >
            <ChevronRight size={20} />
          </button>

          {/* Fullscreen button */}
          <button
            onClick={openFullscreen}
            className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-700 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            aria-label="Открыть на весь экран"
          >
            <ZoomIn size={18} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-3 right-3 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {(mainRef.current?.activeIndex ?? 0) + 1} / {images.length}
          </div>
        </div>

        {/* ── Thumbnails ── */}
        {images.length > 1 && (
          <Swiper
            modules={[Thumbs, A11y]}
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView="auto"
            watchSlidesProgress
            className="w-full"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx} style={{ width: 'auto' }}>
                <button
                  className="block relative w-20 h-14 rounded-lg overflow-hidden border-2 border-transparent [.swiper-slide-thumb-active_&]:border-[#1B5E20] transition-colors focus:outline-none focus:border-[#1B5E20]"
                  aria-label={`Фото ${idx + 1}`}
                >
                  {!imgErrors[idx] ? (
                    <Image
                      src={img}
                      alt={`Фото ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      onError={() => onImgError(idx)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                      <Home size={20} />
                    </div>
                  )}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* ── Fullscreen Lightbox ── */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Галерея фотографий"
        >
          {/* Close */}
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Закрыть"
          >
            <X size={20} />
          </button>

          {/* Main fullscreen swiper */}
          <div className="w-full max-w-5xl px-16" onClick={(e) => e.stopPropagation()}>
            <Swiper
              modules={[Navigation, A11y]}
              onSwiper={(s) => { fsRef.current = s }}
              a11y={{ prevSlideMessage: 'Предыдущее фото', nextSlideMessage: 'Следующее фото' }}
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                    {!imgErrors[idx] ? (
                      <Image
                        src={img}
                        alt={`${projectName} — фото ${idx + 1}`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                        <Home size={64} />
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Fullscreen nav */}
          <button
            onClick={(e) => { e.stopPropagation(); fsRef.current?.slidePrev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Предыдущее фото"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); fsRef.current?.slideNext() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Следующее фото"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </>
  )
}
