import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { MapPin, Home } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import CallForm from '@/components/forms/CallForm'

interface PortfolioItem {
  id: string
  title: string
  location: string
  area: number
  completedAt: string
  image: string
  category: string
}

const MOCK_PORTFOLIO: PortfolioItem[] = Array.from({ length: 9 }, (_, i) => ({
  id: `obj-${i + 1}`,
  title: ['Финский дом в Подмосковье', 'Барнхаус в Ленинградской области', 'Современный коттедж в Сочи', 'Одноэтажный дом во Владимире', 'Двухэтажный дом в Твери'][i % 5],
  location: ['Московская обл.', 'Ленинградская обл.', 'Краснодарский край', 'Владимирская обл.', 'Тверская обл.'][i % 5],
  area: 65 + i * 10,
  completedAt: `${2024 - Math.floor(i / 3)}-${String(12 - (i % 12)).padStart(2, '0')}-01`,
  image: [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop',
  ][i % 3],
  category: ['Финские', 'Барнхаус', 'Современные', 'Одноэтажные', 'Двухэтажные'][i % 5],
}))

const CATEGORIES = ['Все', 'Финские', 'Барнхаус', 'Современные', 'Одноэтажные', 'Двухэтажные']

interface PortfolioPageProps {
  items: PortfolioItem[]
}

export default function PortfolioPage({ items }: PortfolioPageProps) {
  const [activeCategory, setActiveCategory] = useState('Все')
  const [selected, setSelected] = useState<PortfolioItem | null>(null)

  const filtered = activeCategory === 'Все' ? items : items.filter((i) => i.category === activeCategory)

  return (
    <Layout
      title="Портфолио — построенные каркасные дома | ДомСтрой"
      description="Реальные построенные объекты: фото готовых каркасных домов в разных регионах России. Площадь, стиль, регион."
      canonical="/portfolio"
    >
      {/* Header */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl mb-3">Портфолио</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Реальные объекты, построенные нашей командой по всей России
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                activeCategory === cat
                  ? 'bg-primary border-primary text-white'
                  : 'border-gray-200 text-neutral-dark hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="group card text-left"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-light">
                <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                  <Home size={48} />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <span className="absolute top-3 left-3 badge bg-primary text-white text-xs">
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold text-base mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-neutral-medium">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Home size={13} />
                    {item.area} м²
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox modal */}
        {selected && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[4/3] bg-neutral-light rounded-xl mb-4 flex items-center justify-center">
                <Home size={64} className="text-gray-300" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">{selected.title}</h3>
              <div className="flex gap-4 text-sm text-neutral-medium mb-4">
                <span><MapPin size={14} className="inline mr-1" />{selected.location}</span>
                <span><Home size={14} className="inline mr-1" />{selected.area} м²</span>
              </div>
              <button onClick={() => setSelected(null)} className="btn-outline w-full">Закрыть</button>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-neutral-light rounded-2xl p-8 text-center">
          <h2 className="section-title mb-3">Хотите такой же дом?</h2>
          <p className="section-subtitle mb-6 mx-auto">Оставьте заявку — мы подберём подходящий проект и рассчитаем стоимость</p>
          <div className="max-w-sm mx-auto bg-white rounded-xl p-5 shadow-sm">
            <CallForm />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<PortfolioPageProps> = async () => {
  return { props: { items: MOCK_PORTFOLIO } }
}
