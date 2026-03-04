import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import {
  Heart, Phone, Calculator, CheckCircle, Home, Bed, Bath, Clock,
  Layers, Ruler, BarChart2, ArrowLeft, Flame,
} from 'lucide-react'
import Layout from '@/components/layout/Layout'
import FormModal, { type FormType } from '@/components/modals/FormModal'
import ProjectGallery    from '@/components/project/ProjectGallery'
import ProjectPlans      from '@/components/project/ProjectPlans'
import ProjectFAQ        from '@/components/project/ProjectFAQ'
import ProjectReviews    from '@/components/project/ProjectReviews'
import ProjectSimilar    from '@/components/project/ProjectSimilar'
import ProjectServices   from '@/components/project/ProjectServices'
import ProjectFinancing  from '@/components/project/ProjectFinancing'
import ShareButtons      from '@/components/project/ShareButtons'
import { formatPrice, formatArea } from '@/utils/formatPrice'
import { useCatalogStore } from '@/store/catalogStore'
import { getProjectById, getSimilarProjects } from '@/lib/catalogFilter'
import type { Project } from '@/types'

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface ProjectPageProps {
  project: Project
  similar: Project[]
}

/* ─── Structured data ───────────────────────────────────────────────────── */

function buildJsonLd(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: project.name,
    description: project.description.slice(0, 160),
    image: project.images[0] ?? '',
    offers: {
      '@type': 'Offer',
      price: project.price.basePrice,
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: project.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: project.rating,
          reviewCount: project.reviewCount ?? 0,
        }
      : undefined,
  }
}

/* ─── Tech specs table ──────────────────────────────────────────────────── */

const TECH_SPECS = (p: Project) => [
  { label: 'Материал каркаса',  value: p.characteristics.material },
  { label: 'Утепление',         value: p.characteristics.insulation },
  { label: 'Кровля',            value: p.characteristics.roofing },
  { label: 'Энергоэффективность', value: 'Класс B (EN 13829)' },
  { label: 'Звукоизоляция',     value: '≥ 45 дБ' },
  { label: 'Гарантия на конструктив', value: '25 лет' },
  { label: 'Пожарная безопасность', value: 'НГ (негорючий фасад)' },
  { label: 'Основные размеры',  value: p.characteristics.size },
]

/* ─── Page component ────────────────────────────────────────────────────── */

export default function ProjectPage({ project, similar }: ProjectPageProps) {
  const [configuration, setConfiguration] = useState<'base' | 'finishing' | 'turnkey'>('base')
  const [modalOpen, setModalOpen]         = useState(false)
  const [modalType, setModalType]         = useState<FormType>('quote')

  const openModal = (type: FormType) => { setModalType(type); setModalOpen(true) }

  const isFavorite  = useCatalogStore((s) => s.isFavorite(project.id))
  const isInCompare = useCatalogStore((s) => s.isInCompare(project.id))
  const compareLen  = useCatalogStore((s) => s.compare.length)
  const toggleFav   = useCatalogStore((s) => s.toggleFavorite)
  const toggleCmp   = useCatalogStore((s) => s.toggleCompare)

  const priceMap = {
    base:      project.price.basePrice,
    finishing: project.price.withFinishing,
    turnkey:   project.price.turnkey,
  }
  const currentPrice = priceMap[configuration]
  const monthlyApprox = Math.round(currentPrice / 240 / 1000)

  const pageTitle = `${project.name} — каркасный дом ${formatArea(project.characteristics.area)} | ДомСтрой`
  const pageDesc  = project.metaDescription ??
    `${project.name}: ${project.characteristics.area} м², ${project.characteristics.floors} этаж, цена от ${formatPrice(project.price.basePrice)}. Гарантия 25 лет. Строительство за ${project.characteristics.buildingTime}.`

  const jsonLd = buildJsonLd(project)

  const compareDisabled = !isInCompare && compareLen >= 4

  return (
    <Layout title={pageTitle} description={pageDesc} canonical={`/projects/${project.slug}`}>
      {/* Open Graph / JSON-LD */}
      <Head>
        <meta property="og:title"       content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type"        content="product" />
        {project.images[0] && <meta property="og:image" content={project.images[0]} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      {/* ── Breadcrumb ── */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/"        className="hover:text-[#1B5E20] transition-colors">Главная</Link>
          <span>›</span>
          <Link href="/catalog" className="hover:text-[#1B5E20] transition-colors">Каталог</Link>
          <span>›</span>
          <span className="text-gray-800 truncate">{project.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Back link */}
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1B5E20] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Вернуться в каталог
        </Link>

        {/* ══════════════════════════════════════════════════════════
            БЛОК 1 + 2: Галерея + Инфопанель (двухколоночный)
        ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">

          {/* ── Gallery (element #1) ── */}
          <ProjectGallery images={project.images} projectName={project.name} />

          {/* ── Info Panel (element #2) ── */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {project.isPopular && (
                <span className="badge bg-orange-50 text-orange-600 border border-orange-200 text-xs">
                  <Flame size={11} /> Популярный
                </span>
              )}
              {project.isNew && (
                <span className="badge bg-blue-50 text-blue-600 border border-blue-200 text-xs">Новинка</span>
              )}
              <span className="badge bg-green-50 text-[#1B5E20] border border-green-200 text-xs">
                <CheckCircle size={11} /> В наличии
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-gray-800 mb-2 leading-tight">
              {project.name}
            </h1>
            <p className="text-sm text-gray-400 mb-4">Артикул: {project.id.toUpperCase()}</p>

            {/* Rating */}
            {project.rating && (
              <div className="flex items-center gap-2 mb-5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={s <= Math.round(project.rating!) ? 'text-yellow-400 text-lg' : 'text-gray-200 text-lg'}>★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {project.rating} ({project.reviewCount ?? 0} отзывов)
                </span>
              </div>
            )}

            {/* Quick specs */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <Home   size={15} className="text-[#1B5E20]" /> {formatArea(project.characteristics.area)}
              </span>
              <span className="flex items-center gap-1.5">
                <Bed    size={15} className="text-[#1B5E20]" /> {project.characteristics.bedrooms} спал.
              </span>
              <span className="flex items-center gap-1.5">
                <Bath   size={15} className="text-[#1B5E20]" /> {project.characteristics.bathrooms} санузл.
              </span>
              <span className="flex items-center gap-1.5">
                <Layers size={15} className="text-[#1B5E20]" /> {project.characteristics.floors} эт.
              </span>
              <span className="flex items-center gap-1.5">
                <Ruler  size={15} className="text-[#1B5E20]" /> {project.characteristics.size}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock  size={15} className="text-[#1B5E20]" /> {project.characteristics.buildingTime}
              </span>
            </div>

            {/* Configuration selector */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">Комплектация:</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: 'base'      as const, label: 'Без отделки', price: project.price.basePrice },
                  { key: 'finishing' as const, label: 'С отделкой',  price: project.price.withFinishing },
                  { key: 'turnkey'   as const, label: 'Под ключ',    price: project.price.turnkey },
                ]).map(({ key, label, price }) => (
                  <button
                    key={key}
                    onClick={() => setConfiguration(key)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-medium border-2 transition-colors leading-tight ${
                      configuration === key
                        ? 'border-[#1B5E20] bg-[#1B5E20] text-white'
                        : 'border-gray-200 hover:border-[#1B5E20] text-gray-700'
                    }`}
                  >
                    <span className="block">{label}</span>
                    <span className="block text-[10px] mt-0.5 opacity-75">{formatPrice(price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-5">
              <p className="text-xs text-gray-500 mb-1">Стоимость ({
                configuration === 'base' ? 'без отделки' :
                configuration === 'finishing' ? 'с отделкой' : 'под ключ'
              })</p>
              <p className="font-heading font-bold text-3xl text-[#1B5E20] mb-1">
                {formatPrice(currentPrice)}
              </p>
              <p className="text-xs text-gray-400">
                или от {monthlyApprox} тыс. ₽/мес при ипотеке на 20 лет
              </p>
            </div>

            {/* CTA buttons (element #8) */}
            <div className="flex flex-col gap-3 mb-4">
              <button
                onClick={() => openModal('quote')}
                className="btn-primary w-full text-base"
              >
                <Phone size={18} />
                Заказать расчёт стоимости
              </button>
              <button
                onClick={() => openModal('call')}
                className="btn-outline w-full text-base"
              >
                <Calculator size={18} />
                Онлайн-калькулятор
              </button>
            </div>

            {/* Favorite / Compare / Compare link */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => toggleFav(project.id)}
                className={`flex items-center gap-2 text-sm border-2 rounded-xl px-4 py-2 transition-colors min-h-[44px] ${
                  isFavorite
                    ? 'border-red-200 text-red-500 bg-red-50'
                    : 'border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400'
                }`}
              >
                <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'В избранном' : 'В избранное'}
              </button>

              <button
                onClick={() => !compareDisabled && toggleCmp(project)}
                disabled={compareDisabled}
                title={compareDisabled ? 'Максимум 4 проекта для сравнения' : undefined}
                className={`flex items-center gap-2 text-sm border-2 rounded-xl px-4 py-2 transition-colors min-h-[44px] ${
                  isInCompare
                    ? 'border-[#0288D1] text-[#0288D1] bg-blue-50'
                    : compareDisabled
                    ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                    : 'border-gray-200 text-gray-500 hover:border-[#0288D1] hover:text-[#0288D1]'
                }`}
              >
                <BarChart2 size={16} />
                {isInCompare ? 'Убрать' : 'Сравнить'}
              </button>
            </div>

            {/* Share buttons (element #9) */}
            <ShareButtons title={project.name} />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            БЛОК 3 + 4: Описание и Характеристики
        ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">

          {/* Description (element #4) + Video (element #7) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="section-title mb-4">Описание проекта</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {project.description.split('\n\n').map((para, i) => (
                  <p key={i}>{para.trim()}</p>
                ))}
              </div>
            </div>

            {/* Floor plans (element #5) */}
            <ProjectPlans
              floorPlans={project.floorPlans}
              projectName={project.name}
              floors={project.characteristics.floors}
            />

            {/* Video (element #7) */}
            {project.videoUrl && (
              <div>
                <h3 className="font-heading font-semibold text-xl text-gray-800 mb-3">Видео проекта</h3>
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
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

          {/* Characteristics table (element #3) */}
          <div className="space-y-6">
            <div>
              <h2 className="section-title mb-4">Характеристики</h2>
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                {[
                  ['Площадь',           formatArea(project.characteristics.area)],
                  ['Размер',            project.characteristics.size],
                  ['Этажей',            String(project.characteristics.floors)],
                  ['Спален',            String(project.characteristics.bedrooms)],
                  ['Санузлов',          String(project.characteristics.bathrooms)],
                  ['Материал',          project.characteristics.material],
                  ['Утепление',         project.characteristics.insulation],
                  ['Кровля',            project.characteristics.roofing],
                  ['Срок строительства',project.characteristics.buildingTime],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between px-4 py-3 border-b border-gray-200 last:border-0 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-800 text-right ml-4">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical specs (element #11) */}
            <div>
              <h3 className="font-heading font-semibold text-lg text-gray-800 mb-3">Технические характеристики</h3>
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                {TECH_SPECS(project).map(({ label, value }) => (
                  <div key={label} className="flex justify-between px-4 py-3 border-b border-gray-200 last:border-0 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-800 text-right ml-4">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            БЛОК 10: Отзывы по проекту
        ═══════════════════════════════════════════════════════════ */}
        {project.reviews && project.reviews.length > 0 && (
          <div className="mb-14">
            <ProjectReviews reviews={project.reviews} projectName={project.name} />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            БЛОК 12: FAQ
        ═══════════════════════════════════════════════════════════ */}
        <div className="mb-14">
          <ProjectFAQ />
        </div>

        {/* ══════════════════════════════════════════════════════════
            БЛОК 14: Дополнительные услуги
        ═══════════════════════════════════════════════════════════ */}
        <div className="mb-14">
          <ProjectServices />
        </div>

        {/* ══════════════════════════════════════════════════════════
            БЛОК 15: Финансирование
        ═══════════════════════════════════════════════════════════ */}
        <div className="mb-14">
          <ProjectFinancing price={currentPrice} />
        </div>

        {/* ══════════════════════════════════════════════════════════
            БЛОК 13: Похожие проекты
        ═══════════════════════════════════════════════════════════ */}
        {similar.length > 0 && (
          <div className="mb-14">
            <ProjectSimilar projects={similar} />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            БЛОК 16: Footer CTA
        ═══════════════════════════════════════════════════════════ */}
        <div className="bg-[#1B5E20] rounded-2xl p-8 text-center text-white">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">
            Готовы выбрать этот дом?
          </h2>
          <p className="text-green-200 mb-6 max-w-xl mx-auto">
            Оставьте заявку — мы перезвоним в течение 30 минут и ответим на все вопросы
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => openModal('call')}
              className="bg-white text-[#1B5E20] hover:bg-green-50 font-semibold px-8 py-3 rounded-xl transition-colors min-h-[48px] inline-flex items-center justify-center gap-2"
            >
              <Phone size={18} />
              Заказать звонок
            </button>
            <button
              onClick={() => openModal('quote')}
              className="bg-[#FF9100] hover:bg-orange-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors min-h-[48px] inline-flex items-center justify-center gap-2"
            >
              <Calculator size={18} />
              Получить расчёт
            </button>
          </div>
        </div>

      </div>

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formType={modalType}
        projectId={project.id}
      />
    </Layout>
  )
}

/* ─── SSR data loading ──────────────────────────────────────────────────── */

export const getServerSideProps: GetServerSideProps<ProjectPageProps> = async ({ params }) => {
  const id = params?.id as string

  const project = getProjectById(id)
  if (!project) {
    return { notFound: true }
  }

  const similar = getSimilarProjects(id, 4)

  return {
    props: {
      project: JSON.parse(JSON.stringify(project)) as Project,
      similar: JSON.parse(JSON.stringify(similar)) as Project[],
    },
  }
}
