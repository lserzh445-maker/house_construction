import React, { useState } from 'react'
import { Phone, Calculator } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import HeroSection from '@/components/home/HeroSection'
import CompanyAbout from '@/components/home/CompanyAbout'
import PopularProjects from '@/components/home/PopularProjects'
import Advantages from '@/components/home/Advantages'
import OrderProcess from '@/components/home/OrderProcess'
import ReviewsCarousel from '@/components/home/ReviewsCarousel'
import BankPartners from '@/components/home/BankPartners'
import LatestBlog from '@/components/home/LatestBlog'
import FormModal, { type FormType } from '@/components/modals/FormModal'

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<FormType>('call')

  const openModal = (type: FormType) => {
    setModalType(type)
    setModalOpen(true)
  }

  return (
    <Layout
      title="Каркасные дома под ключ — строительство за 4–6 недель | ДомСтрой"
      description="Строим каркасные дома под ключ с 2007 года. 870+ объектов. Гарантия 25 лет. Ипотека от 5%. Бесплатный расчёт стоимости."
      canonical="/"
    >
      <HeroSection />
      <CompanyAbout />
      <PopularProjects />
      <Advantages />
      <OrderProcess />
      <ReviewsCarousel />
      <BankPartners />
      <LatestBlog />

      {/* ── CTA Section ── */}
      <section className="section-padding bg-[#1B5E20]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-green-300 text-sm font-semibold uppercase tracking-widest mb-3">
            Начните прямо сейчас
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Готовы построить дом мечты?
          </h2>
          <p className="text-green-200 text-lg max-w-xl mx-auto mb-8">
            Оставьте заявку — мы перезвоним в течение 30 минут и ответим на все вопросы бесплатно
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => openModal('call')}
              className="bg-white text-[#1B5E20] hover:bg-green-50 font-semibold px-8 py-3 rounded-xl transition-colors min-h-[48px] inline-flex items-center justify-center gap-2 text-base"
            >
              <Phone size={20} />
              Заказать звонок
            </button>
            <button
              onClick={() => openModal('quote')}
              className="bg-[#FF9100] hover:bg-orange-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors min-h-[48px] inline-flex items-center justify-center gap-2 text-base"
            >
              <Calculator size={20} />
              Получить расчёт
            </button>
          </div>
          <p className="text-green-300 text-sm mt-6">
            17+ лет опыта · 870+ построенных домов · Гарантия 25 лет
          </p>
        </div>
      </section>

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formType={modalType}
      />
    </Layout>
  )
}
