import React from 'react'
import { Timer, Tag } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import CallForm from '@/components/forms/CallForm'

const PROMOTIONS = [
  {
    id: 1,
    badge: 'Горячее предложение',
    title: 'Скидка 10% на все проекты в марте',
    description: 'При заключении договора до 31 марта 2026 года — скидка 10% от базовой стоимости проекта. Распространяется на все типовые проекты каталога.',
    conditions: ['Заключение договора до 31.03.2026', 'Аванс 30% в течение 5 дней', 'Не суммируется с другими акциями'],
    expiresAt: '31.03.2026',
    isHot: true,
  },
  {
    id: 2,
    badge: 'Специальное предложение',
    title: 'Бесплатный фундамент при заказе дома под ключ',
    description: 'Закажите дом в комплектации «Под ключ» площадью от 80 м² и получите монтаж ленточного фундамента в подарок (стоимостью до 150 000 ₽).',
    conditions: ['Площадь дома от 80 м²', 'Комплектация «Под ключ»', 'Стандартный ленточный фундамент', 'Договор до 30.04.2026'],
    expiresAt: '30.04.2026',
    isHot: false,
  },
  {
    id: 3,
    badge: 'Кешбэк',
    title: 'Кешбэк 50 000 ₽ за отзыв с фото',
    description: 'Напишите развёрнутый отзыв с фотографиями о вашем доме на нашем сайте и в 2ГИС — получите кешбэк 50 000 ₽ на карту.',
    conditions: ['Отзыв не менее 300 символов', 'Минимум 5 фотографий', 'Публикация в течение 30 дней после сдачи', 'Действует для клиентов 2025–2026 годов'],
    expiresAt: '31.12.2026',
    isHot: false,
  },
]

export default function PromotionsPage() {
  return (
    <Layout
      title="Акции и скидки на строительство каркасных домов — ДомСтрой"
      description="Актуальные акции и специальные предложения на строительство каркасных домов. Скидки до 10%, бесплатный фундамент, кешбэк."
      canonical="/promotions"
    >
      {/* Header */}
      <section className="bg-accent text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Tag size={40} className="mx-auto mb-4" />
          <h1 className="font-heading font-bold text-4xl mb-3">Акции и спецпредложения</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Успейте воспользоваться выгодными предложениями — количество мест ограничено
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 space-y-6">
        {PROMOTIONS.map((promo) => (
          <div
            key={promo.id}
            className={`bg-white rounded-2xl border-2 p-6 md:p-8 ${
              promo.isHot ? 'border-accent' : 'border-gray-100'
            } hover:shadow-lg transition-shadow`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <span className={`badge text-xs font-semibold mb-2 inline-block ${
                  promo.isHot ? 'bg-accent text-white' : 'bg-primary-50 text-primary'
                }`}>
                  {promo.badge}
                </span>
                <h2 className="font-heading font-bold text-xl md:text-2xl text-neutral-dark">
                  {promo.title}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-medium bg-neutral-light px-4 py-2 rounded-full">
                <Timer size={16} className={promo.isHot ? 'text-accent' : 'text-primary'} />
                До {promo.expiresAt}
              </div>
            </div>

            <p className="text-neutral-medium leading-relaxed mb-5">{promo.description}</p>

            <div className="mb-6">
              <p className="font-semibold text-sm mb-3">Условия акции:</p>
              <ul className="space-y-1.5">
                {promo.conditions.map((cond) => (
                  <li key={cond} className="flex items-center gap-2 text-sm text-neutral-medium">
                    <span className="w-4 h-4 bg-primary-50 rounded-full flex items-center justify-center text-primary text-xs flex-shrink-0">✓</span>
                    {cond}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={promo.isHot ? 'btn-accent' : 'btn-primary'}
              onClick={() => {
                const form = document.getElementById('cta-form')
                form?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Воспользоваться акцией
            </button>
          </div>
        ))}

        {/* CTA */}
        <div id="cta-form" className="bg-primary rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-heading font-bold text-2xl mb-3">Хотите воспользоваться акцией?</h2>
              <p className="text-primary-100">
                Оставьте заявку и укажите, какая акция вас интересует. Мы свяжемся в течение 30 минут.
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
