import React from 'react'
import Layout from '@/components/layout/Layout'
import HeroSection from '@/components/home/HeroSection'
import CompanyAbout from '@/components/home/CompanyAbout'
import PopularProjects from '@/components/home/PopularProjects'
import Advantages from '@/components/home/Advantages'
import OrderProcess from '@/components/home/OrderProcess'
import ReviewsCarousel from '@/components/home/ReviewsCarousel'
import BankPartners from '@/components/home/BankPartners'
import LatestBlog from '@/components/home/LatestBlog'
import ContactForm from '@/components/forms/ContactForm'

export default function HomePage() {
  return (
    <Layout
      title="Каркасные дома под ключ — строительство за 4–6 недель | ДомСтрой"
      description="Строим каркасные дома под ключ с 2007 года. 870+ объектов. Гарантия 25 лет. Ипотека от 5%. Бесплатный расчёт стоимости."
      canonical="/"
    >
      {/* 1. Hero banner with CTA */}
      <HeroSection />

      {/* 2. Company stats & about */}
      <CompanyAbout />

      {/* 3. Popular projects slider */}
      <PopularProjects />

      {/* 4. Advantages / why choose us */}
      <Advantages />

      {/* 5. Order process — 8 steps */}
      <OrderProcess />

      {/* 6. Client reviews carousel */}
      <ReviewsCarousel />

      {/* 7. Bank partners & financing */}
      <BankPartners />

      {/* 8. Latest blog articles */}
      <LatestBlog />

      {/* 9. Contact form & CTA */}
      <ContactForm />
    </Layout>
  )
}
