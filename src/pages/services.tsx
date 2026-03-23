import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Truck, Shield, ArrowRight } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import CallForm from '@/components/forms/CallForm'

const SERVICES = [
  {
    icon: Pencil,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
    title: 'Индивидуальное проектирование',
    description: 'Разработаем проект дома любой сложности с нуля под ваши требования. Наши архитекторы учтут особенности участка, ваши предпочтения по планировке и бюджет.',
    items: ['Выезд архитектора на участок', 'Разработка проекта (2–4 недели)', 'Конструкторские расчёты', 'Проект инженерных систем', 'Визуализация в 3D'],
    href: '/contacts',
    cta: 'Заказать проект',
  },
  {
    icon: Truck,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    title: 'Доставка и монтаж',
    description: 'Доставляем и монтируем дома по всей России. Наша бригада выедет на объект в течение 2 недель после заключения договора.',
    items: ['Доставка материалов на участок', 'Монтаж каркаса и кровли', 'Установка окон и дверей', 'Внешняя и внутренняя отделка', 'Сдача под ключ с актом'],
    href: '/calculator',
    cta: 'Рассчитать стоимость',
  },
  {
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
    title: 'Контроль качества',
    description: 'На каждом этапе строительства работает технический надзор. Мы используем только сертифицированные материалы с паспортами качества.',
    items: ['Контроль качества материалов', 'Поэтапная приёмка работ', 'Фото и видеоотчёты с объекта', 'Гарантийный паспорт при сдаче', 'Гарантия 25 лет на конструктив'],
    href: '/about',
    cta: 'Узнать подробнее',
  },
]

export default function ServicesPage() {
  return (
    <Layout
      title="Услуги строительства каркасных домов — ДомСтрой"
      description="Полный спектр услуг: проектирование, строительство, доставка, монтаж, отделка. Гарантия 25 лет. Контроль качества на каждом этапе."
      canonical="/services"
    >
      {/* Header */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl mb-3">Услуги</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Полный цикл строительства от проекта до ключей
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 space-y-10">
        {SERVICES.map(({ icon: Icon, image, title, description, items, href, cta }, idx) => (
          <div
            key={title}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
          >
            <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-5">
                <Icon size={28} className="text-primary" />
              </div>
              <h2 className="section-title text-2xl mb-3">{title}</h2>
              <p className="text-neutral-medium leading-relaxed mb-5">{description}</p>
              <ul className="space-y-2 mb-6">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>
                    <span className="text-neutral-dark">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href={href} className="btn-primary inline-flex">
                {cta}
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className={`rounded-2xl aspect-[4/3] overflow-hidden ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Готовы начать?</h2>
              <p className="text-primary-100">
                Оставьте заявку — наш менеджер свяжется с вами в течение 30 минут и ответит на все вопросы.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <CallForm />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
