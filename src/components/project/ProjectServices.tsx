import React from 'react'
import Link from 'next/link'
import { Ruler, Truck, Wrench, Shield, ArrowRight } from 'lucide-react'

const SERVICES = [
  {
    icon: Ruler,
    title: 'Индивидуальное проектирование',
    description: 'Разработаем проект по вашим пожеланиям с учётом участка и бюджета.',
    price: 'от 50 000 ₽',
    href: '/services',
  },
  {
    icon: Truck,
    title: 'Доставка и монтаж',
    description: 'Доставка материалов и сборка дома «под ключ» нашей бригадой.',
    price: 'от 50 000 ₽',
    href: '/services',
  },
  {
    icon: Wrench,
    title: 'Подключение коммуникаций',
    description: 'Электрика, водоснабжение, канализация, отопление — всё под ключ.',
    price: 'от 80 000 ₽',
    href: '/services',
  },
  {
    icon: Shield,
    title: 'Страховка строительства',
    description: 'Страхование строительных рисков и защита вашего имущества.',
    price: '3% от стоимости',
    href: '/services',
  },
]

export default function ProjectServices() {
  return (
    <section aria-labelledby="services-title">
      <h2 id="services-title" className="section-title mb-6">Дополнительные услуги</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SERVICES.map(({ icon: Icon, title, description, price, href }) => (
          <Link
            key={title}
            href={href}
            className="group flex gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-[#1B5E20] hover:shadow-sm transition-all"
          >
            <div className="w-11 h-11 rounded-lg bg-[#1B5E20]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1B5E20]/20 transition-colors">
              <Icon size={20} className="text-[#1B5E20]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 mb-1 text-sm group-hover:text-[#1B5E20] transition-colors">
                {title}
              </h3>
              <p className="text-xs text-gray-500 mb-2 leading-relaxed">{description}</p>
              <span className="text-xs font-semibold text-[#FF9100]">{price}</span>
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-[#1B5E20] flex-shrink-0 mt-0.5 transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  )
}
