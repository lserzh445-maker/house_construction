import React, { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, A11y } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight, Heart, Home, Bed, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card, CardImage } from '@/components/ui/Card'
import { formatPrice, formatArea } from '@/utils/formatPrice'
import { fadeInUp, stagger, viewport } from '@/lib/animations'
import type { Project } from '@/types'
import styles from './PopularProjects.module.css'

import 'swiper/css'
import 'swiper/css/pagination'

/* ─── Props ──────────────────────────────────────────────────────────── */
export interface PopularProjectsProps {
  projects?: Project[]
  className?: string
}

/* ─── Mock data (replace with API) ──────────────────────────────────── */
const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'fin-d5', name: 'Финский дом Д-5', slug: 'fin-d5',
    description: 'Двухэтажный каркасный дом в финском стиле.',
    price: { basePrice: 8160000, withFinishing: 9792000, turnkey: 11448000 },
    characteristics: { area: 85, size: '7×8', floors: 2, bedrooms: 2, bathrooms: 1, material: 'Брус 150×100', insulation: 'Минвата 150мм', roofing: 'Металлочерепица', buildingTime: '4–6 недель' },
    images: ['https://images.unsplash.com/photo-1600210174918-92ae00ecf461?w=800&h=600&fit=crop'], floorPlans: [], category: 'finnish', style: 'finnish',
    features: ['terrace'], rating: 4.9, reviewCount: 28, isPopular: true,
  },
  {
    id: 'modern-m1', name: 'Современный М-1', slug: 'modern-m1',
    description: 'Одноэтажный дом с открытой планировкой.',
    price: { basePrice: 5400000, withFinishing: 6480000, turnkey: 7560000 },
    characteristics: { area: 65, size: '8×9', floors: 1, bedrooms: 2, bathrooms: 1, material: 'Брус 150×50', insulation: 'Эковата 200мм', roofing: 'Мягкая черепица', buildingTime: '3–4 недели' },
    images: ['https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&h=600&fit=crop'], floorPlans: [], category: 'one-story', style: 'modern',
    features: ['terrace', 'balcony'], rating: 4.8, reviewCount: 14, isNew: true,
  },
  {
    id: 'barn-b3', name: 'Барнхаус Б-3', slug: 'barn-b3',
    description: 'Стильный барнхаус с мансардой и большими окнами.',
    price: { basePrice: 9800000, withFinishing: 11760000, turnkey: 13720000 },
    characteristics: { area: 120, size: '10×12', floors: 2, bedrooms: 3, bathrooms: 2, material: 'Брус 200×100', insulation: 'Минвата 200мм', roofing: 'Металлочерепица', buildingTime: '6–8 недель' },
    images: ['https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=800&h=600&fit=crop'], floorPlans: [], category: 'with-mansard', style: 'barnhouse',
    features: ['terrace', 'sauna'], rating: 4.7, reviewCount: 9,
  },
  {
    id: 'canadian-k2', name: 'Канадский К-2', slug: 'canadian-k2',
    description: 'Практичный и тёплый дом по канадской технологии.',
    price: { basePrice: 6900000, withFinishing: 8280000, turnkey: 9660000 },
    characteristics: { area: 95, size: '9×11', floors: 2, bedrooms: 3, bathrooms: 1, material: 'SIP-панели', insulation: 'ПСБ 200мм', roofing: 'Металлочерепица', buildingTime: '3–5 недель' },
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'], floorPlans: [], category: 'two-story', style: 'canadian',
    features: ['garage'], rating: 4.8, reviewCount: 19, isPopular: true,
  },
  {
    id: 'cottage-k5', name: 'Коттедж К-5', slug: 'cottage-k5',
    description: 'Просторный коттедж для большой семьи.',
    price: { basePrice: 12500000, withFinishing: 15000000, turnkey: 17500000 },
    characteristics: { area: 180, size: '12×15', floors: 2, bedrooms: 4, bathrooms: 2, material: 'Брус 200×100', insulation: 'Минвата 200мм', roofing: 'Натуральная черепица', buildingTime: '8–10 недель' },
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop'], floorPlans: [], category: 'cottage', style: 'modern',
    features: ['terrace', 'sauna', 'garage'], rating: 4.9, reviewCount: 7,
  },
  {
    id: 'eco-e1', name: 'Эко Е-1', slug: 'eco-e1',
    description: 'Уютный одноэтажный дом с экостилем.',
    price: { basePrice: 4200000, withFinishing: 5040000, turnkey: 5880000 },
    characteristics: { area: 55, size: '7×8', floors: 1, bedrooms: 2, bathrooms: 1, material: 'Брус 150×100', insulation: 'Эковата 150мм', roofing: 'Мягкая черепица', buildingTime: '3–4 недели' },
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'], floorPlans: [], category: 'one-story', style: 'finnish',
    features: ['terrace'], rating: 4.6, reviewCount: 12, isNew: true,
  },
]

/* ─── Project Slide Card ─────────────────────────────────────────────── */
function ProjectCard({ project }: { project: Project }) {
  const [imgErr, setImgErr] = useState(false)
  const [fav, setFav] = useState(false)

  return (
    <Link href={`/projects/${project.id}`} className="block group h-full">
      <Card className="h-full flex flex-col">
        <CardImage aspectRatio="16/10">
          {!imgErr ? (
            <Image
              src={project.images[0]}
              alt={project.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgErr(true)}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-200 bg-neutral-light">
              <Home size={40} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {project.isNew     && <Badge variant="secondary" className="text-[11px]">Новинка</Badge>}
            {project.isPopular && <Badge variant="accent"    className="text-[11px]">Хит продаж</Badge>}
          </div>

          {/* Favorite */}
          <button
            onClick={(e) => { e.preventDefault(); setFav(!fav) }}
            aria-label="Избранное"
            className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-colors ${fav ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
          >
            <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </CardImage>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-heading font-semibold text-base mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {project.name}
          </h3>

          <div className="flex gap-4 text-sm text-neutral-medium mb-3">
            <span className="flex items-center gap-1"><Home size={13} className="text-primary" />{formatArea(project.characteristics.area)}</span>
            <span className="flex items-center gap-1"><Bed  size={13} className="text-primary" />{project.characteristics.bedrooms} спал.</span>
            <span>{project.characteristics.floors} эт.</span>
          </div>

          {project.rating && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-yellow-400 text-sm">{'★'.repeat(Math.round(project.rating))}{'☆'.repeat(5 - Math.round(project.rating))}</span>
              <span className="text-xs text-neutral-medium">{project.rating} ({project.reviewCount})</span>
            </div>
          )}

          <div className="mt-auto">
            <p className="text-xs text-neutral-medium mb-0.5">Цена от</p>
            <p className="font-heading font-bold text-xl text-primary mb-3">
              {formatPrice(project.price.basePrice)}
            </p>
            <div className="flex items-center justify-between">
              <span className="btn-accent text-sm px-4 py-2 min-h-0 h-9 pointer-events-none">
                Узнать цену
              </span>
              <span className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                Подробнее <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function PopularProjects({ projects, className = '' }: PopularProjectsProps) {
  const data = projects ?? DEFAULT_PROJECTS
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <section className={`section-padding bg-neutral-light ${className}`} aria-labelledby="projects-title">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <motion.span variants={fadeInUp} className="text-accent font-semibold text-sm uppercase tracking-widest">
              Наши проекты
            </motion.span>
            <motion.h2 variants={fadeInUp} id="projects-title" className="section-title mt-1 mb-0">
              Популярные проекты
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mt-2">
              Самые востребованные дома по цене, площади и скорости строительства
            </motion.p>
          </div>
          <motion.div variants={fadeInUp}>
            <Link href="/catalog" className="btn-outline text-sm px-5 py-2.5 min-h-0 h-10 whitespace-nowrap">
              Весь каталог <ArrowRight size={15} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Swiper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6 }}
          className={styles.wrap}
        >
          {/* Nav buttons */}
          <button
            aria-label="Предыдущий"
            className={styles.navBtn + ' ' + styles.navPrev}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            aria-label="Следующий"
            className={styles.navBtn + ' ' + styles.navNext}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ChevronRight size={20} />
          </button>

          <Swiper
            modules={[Pagination, A11y]}
            onSwiper={(s) => { swiperRef.current = s }}
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640:  { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            a11y={{ prevSlideMessage: 'Предыдущий проект', nextSlideMessage: 'Следующий проект' }}
          >
            {data.map((project) => (
              <SwiperSlide key={project.id} className="h-auto">
                <ProjectCard project={project} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  )
}
