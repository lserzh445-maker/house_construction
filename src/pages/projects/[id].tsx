import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Heart, Share2, ArrowLeft, Phone, Calculator,
  CheckCircle, Home, Bed, Bath, Clock, ChevronDown, ChevronUp,
} from 'lucide-react'
import Layout from '@/components/layout/Layout'
import CallForm from '@/components/forms/CallForm'
import ProductCard from '@/components/catalog/ProductCard'
import { formatPrice, formatArea } from '@/utils/formatPrice'
import type { Project } from '@/types'

// Mock — replace with API call
const MOCK_PROJECT: Project = {
  id: 'fin-d5',
  name: 'Финский дом Д-5',
  slug: 'fin-d5',
  description: `Двухэтажный каркасный дом в финском стиле — это воплощение скандинавской функциональности и уюта.
  Продуманная планировка позволяет разместить на 85 м² всё необходимое для комфортной семейной жизни.

  Первый этаж включает просторную кухню-гостиную с выходом на террасу, ванную комнату и техническое помещение.
  На втором этаже расположены две спальни и совмещённый санузел.

  Строительство занимает 4–6 недель в любое время года. Мы используем только сертифицированные материалы
  и соблюдаем СНиП на каждом этапе работ.`,
  price: { basePrice: 8160000, withFinishing: 9792000, turnkey: 11448000 },
  characteristics: {
    area: 85,
    size: '7×8 м',
    floors: 2,
    bedrooms: 2,
    bathrooms: 1,
    material: 'Брус сечением 150×100',
    insulation: 'Минеральная вата 150 мм',
    roofing: 'Металлочерепица',
    buildingTime: '4–6 недель',
  },
  images: [
    '/images/projects/fin-d5-1.jpg',
    '/images/projects/fin-d5-2.jpg',
    '/images/projects/fin-d5-3.jpg',
  ],
  floorPlans: ['/plans/fin-d5-floor1.pdf'],
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  category: 'finnish',
  style: 'finnish',
  features: ['terrace'],
  rating: 4.9,
  reviewCount: 28,
  isPopular: true,
}

const FAQ_ITEMS = [
  { q: 'Можно ли изменить планировку?', a: 'Да, планировку можно адаптировать под ваши пожелания. Наш архитектор разработает измененный проект бесплатно при заказе.' },
  { q: 'Какой фундамент нужен под этот дом?', a: 'Рекомендуем ленточный или свайно-ростверковый фундамент. Тип определяется после геологии участка.' },
  { q: 'Можно ли строить зимой?', a: 'Да, каркасное строительство ведётся круглый год. Работы с бетоном выполняются с применением зимних технологий.' },
  { q: 'Что входит в комплектацию «под ключ»?', a: 'Фундамент, стены, кровля, окна, двери, внешняя и внутренняя отделка, электрика, водоснабжение, отопление.' },
  { q: 'Какая гарантия на дом?', a: 'Гарантия на конструктив — 25 лет. На инженерные системы — 3 года. На кровлю — 10 лет.' },
]

interface ProjectPageProps {
  project: Project
  similar: Project[]
}

export default function ProjectPage({ project, similar }: ProjectPageProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [configuration, setConfiguration] = useState<'base' | 'finishing' | 'turnkey'>('base')

  const currentPrice = {
    base: project.price.basePrice,
    finishing: project.price.withFinishing,
    turnkey: project.price.turnkey,
  }[configuration]

  return (
    <Layout
      title={`${project.name} — каркасный дом ${formatArea(project.characteristics.area)} | ДомСтрой`}
      description={`${project.name}: ${project.characteristics.area} м², ${project.characteristics.floors} этажа, цена от ${formatPrice(project.price.basePrice)}. Гарантия 25 лет, строительство за ${project.characteristics.buildingTime}.`}
      canonical={`/projects/${project.id}`}
    >
      {/* Breadcrumb */}
      <div className="bg-neutral-light border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-neutral-medium">
          <Link href="/" className="hover:text-primary">Главная</Link>
          <span>›</span>
          <Link href="/catalog" className="hover:text-primary">Каталог</Link>
          <span>›</span>
          <span className="text-neutral-dark">{project.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Link href="/catalog" className="inline-flex items-center gap-2 text-sm text-neutral-medium hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={16} />
          Вернуться в каталог
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-light mb-3">
              {project.images[activeImage] ? (
                <Image
                  src={project.images[activeImage]}
                  alt={`${project.name} — фото ${activeImage + 1}`}
                  fill
                  className="object-cover"
                  priority={activeImage === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <Home size={64} />
                </div>
              )}
            </div>
            {project.images.length > 1 && (
              <div className="flex gap-2">
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      idx === activeImage ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt={`Фото ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-3">
              {project.isPopular && (
                <span className="badge bg-accent-50 text-accent-dark text-xs border border-accent-100">Популярный</span>
              )}
              <span className="badge bg-primary-50 text-primary text-xs border border-primary-100">
                <CheckCircle size={12} /> В наличии
              </span>
            </div>

            <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral-dark mb-2">
              {project.name}
            </h1>

            {/* Rating */}
            {project.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={s <= Math.round(project.rating!) ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                  ))}
                </div>
                <span className="text-sm text-neutral-medium">
                  {project.rating} ({project.reviewCount} отзывов)
                </span>
              </div>
            )}

            {/* Specs row */}
            <div className="flex flex-wrap gap-4 mb-5 text-sm">
              <span className="flex items-center gap-1.5 text-neutral-medium">
                <Home size={16} className="text-primary" />
                {formatArea(project.characteristics.area)}
              </span>
              <span className="flex items-center gap-1.5 text-neutral-medium">
                <Bed size={16} className="text-primary" />
                {project.characteristics.bedrooms} спальни
              </span>
              <span className="flex items-center gap-1.5 text-neutral-medium">
                <Bath size={16} className="text-primary" />
                {project.characteristics.bathrooms} сан/узел
              </span>
              <span className="flex items-center gap-1.5 text-neutral-medium">
                <Clock size={16} className="text-primary" />
                {project.characteristics.buildingTime}
              </span>
            </div>

            {/* Configuration selector */}
            <div className="mb-5">
              <p className="text-sm font-semibold mb-2">Комплектация:</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: 'base', label: 'Без отделки' },
                  { key: 'finishing', label: 'С отделкой' },
                  { key: 'turnkey', label: 'Под ключ' },
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setConfiguration(key)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                      configuration === key
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 hover:border-primary text-neutral-dark'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="bg-primary-50 rounded-xl p-4 mb-5">
              <p className="text-sm text-neutral-medium mb-1">Стоимость</p>
              <p className="font-heading font-bold text-3xl text-primary">
                {formatPrice(currentPrice)}
              </p>
              <p className="text-xs text-neutral-medium mt-1">
                или от {Math.round(currentPrice / 240 / 1000)} тыс. ₽/мес при ипотеке на 20 лет
              </p>
            </div>

            {/* CTA */}
            {!showForm ? (
              <div className="flex flex-col gap-3 mb-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary w-full text-base"
                >
                  <Phone size={18} />
                  Заказать расчёт стоимости
                </button>
                <Link href="/calculator" className="btn-outline w-full text-base text-center">
                  <Calculator size={18} />
                  Онлайн-калькулятор
                </Link>
              </div>
            ) : (
              <div className="border border-primary-100 rounded-xl p-4 mb-4">
                <h3 className="font-semibold mb-3">Заказать звонок</h3>
                <CallForm
                  projectName={project.name}
                  onSuccess={() => setShowForm(false)}
                />
                <button onClick={() => setShowForm(false)} className="mt-2 text-sm text-neutral-medium hover:text-neutral-dark w-full">
                  Отмена
                </button>
              </div>
            )}

            {/* Favorite & Share */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex items-center gap-2 text-sm border-2 rounded-lg px-4 py-2 transition-colors ${
                  isFavorite
                    ? 'border-red-300 text-red-500 bg-red-50'
                    : 'border-gray-200 text-neutral-medium hover:border-gray-300'
                }`}
              >
                <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'В избранном' : 'В избранное'}
              </button>
              <button className="flex items-center gap-2 text-sm border-2 border-gray-200 rounded-lg px-4 py-2 text-neutral-medium hover:border-gray-300 transition-colors">
                <Share2 size={16} />
                Поделиться
              </button>
            </div>
          </div>
        </div>

        {/* Description & Characteristics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="section-title text-xl mb-4">Описание проекта</h2>
            <div className="prose prose-sm max-w-none text-neutral-medium leading-relaxed">
              {project.description.split('\n\n').map((para, i) => (
                <p key={i} className="mb-4">{para.trim()}</p>
              ))}
            </div>

            {/* Video */}
            {project.videoUrl && (
              <div className="mt-6">
                <h3 className="font-heading font-semibold text-lg mb-3">Видео проекта</h3>
                <div className="aspect-video rounded-xl overflow-hidden bg-neutral-light">
                  <iframe
                    src={project.videoUrl}
                    title={`Видео: ${project.name}`}
                    className="w-full h-full"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Characteristics Table */}
          <div>
            <h2 className="section-title text-xl mb-4">Характеристики</h2>
            <div className="bg-neutral-light rounded-xl overflow-hidden">
              {[
                ['Площадь', formatArea(project.characteristics.area)],
                ['Размер', project.characteristics.size],
                ['Этажей', String(project.characteristics.floors)],
                ['Спален', String(project.characteristics.bedrooms)],
                ['Санузлов', String(project.characteristics.bathrooms)],
                ['Материал', project.characteristics.material],
                ['Утепление', project.characteristics.insulation],
                ['Кровля', project.characteristics.roofing],
                ['Срок строительства', project.characteristics.buildingTime],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between px-4 py-3 border-b border-gray-200 last:border-0 text-sm">
                  <span className="text-neutral-medium">{label}</span>
                  <span className="font-medium text-neutral-dark text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="section-title mb-6">Часто задаваемые вопросы</h2>
          <div className="space-y-3 max-w-3xl">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-neutral-dark hover:bg-neutral-light transition-colors"
                >
                  <span>{item.q}</span>
                  {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-sm text-neutral-medium leading-relaxed border-t border-gray-100">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Similar Projects */}
        {similar.length > 0 && (
          <div>
            <h2 className="section-title mb-6">Похожие проекты</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similar.map((p) => (
                <ProductCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<ProjectPageProps> = async ({ params }) => {
  const id = params?.id as string
  // TODO: replace with real API calls:
  //   const project = await projectsApi.getById(id)
  //   const similar = await projectsApi.getSimilar(id)
  const project = { ...MOCK_PROJECT, id }
  return {
    props: { project, similar: [] },
  }
}
