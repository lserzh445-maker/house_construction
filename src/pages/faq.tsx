import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import CallForm from '@/components/forms/CallForm'

const FAQ_CATEGORIES = [
  {
    category: 'Общие вопросы',
    items: [
      { q: 'Что такое каркасный дом?', a: 'Каркасный дом — это дом, несущую основу которого составляет деревянный или металлический каркас, заполненный утеплителем и обшитый плитами. Это одна из самых популярных технологий в мире благодаря скорости строительства и высоким теплоизоляционным свойствам.' },
      { q: 'Сколько прослужит каркасный дом?', a: 'При соблюдении технологии строительства и правильном уходе каркасный дом служит 50–100 лет. Мы даём гарантию на конструктив 25 лет.' },
      { q: 'Можно ли жить в каркасном доме круглый год?', a: 'Да, наши дома проектируются для круглогодичного проживания. Стены с утеплителем 150–200 мм и качественные окна обеспечивают комфортную температуру при любом морозе.' },
    ],
  },
  {
    category: 'Строительство',
    items: [
      { q: 'Сколько времени занимает строительство?', a: 'В зависимости от проекта строительство занимает от 3 до 8 недель. Небольшой дом 60–80 м² строится за 4–5 недель, более крупный — за 6–8 недель.' },
      { q: 'Можно ли строить зимой?', a: 'Да. Каркасное строительство ведётся круглый год. Работы с бетонным фундаментом при сильных морозах требуют специальных добавок, что незначительно влияет на стоимость.' },
      { q: 'Нужно ли мне присутствовать на стройке?', a: 'Не обязательно. Ваш личный менеджер присылает фото и видеоотчёты раз в 2–3 дня. Вы всегда можете приехать на осмотр — мы только приветствуем это.' },
      { q: 'Вы строите на всей территории России?', a: 'Да, мы работаем во всех регионах России. Стоимость доставки материалов рассчитывается индивидуально.' },
    ],
  },
  {
    category: 'Цены и оплата',
    items: [
      { q: 'Может ли измениться цена после подписания договора?', a: 'Нет. Мы фиксируем стоимость в договоре до начала работ. Итоговая цена не изменится без вашего согласия.' },
      { q: 'Какие варианты оплаты существуют?', a: 'Оплата поэтапная: аванс 30% при подписании договора, 40% при готовности стен и кровли, 30% при сдаче объекта. Возможна ипотека и рассрочка.' },
      { q: 'Работаете ли вы с материнским капиталом?', a: 'Да, принимаем материнский капитал в качестве части оплаты или первоначального взноса по ипотеке.' },
    ],
  },
  {
    category: 'Проекты и планировка',
    items: [
      { q: 'Можно ли изменить типовой проект?', a: 'Да, мы адаптируем любой типовой проект под ваши потребности. Перенос стен, изменение размеров комнат, добавление гаража или террасы — всё возможно.' },
      { q: 'Разрабатываете ли вы индивидуальные проекты?', a: 'Да. Мы разрабатываем проекты с нуля по вашему техническому заданию. Время разработки — 2–4 недели, стоимость включена в цену строительства.' },
    ],
  },
]

export default function FaqPage() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  const toggle = (key: string) => setOpenItem(openItem === key ? null : key)

  return (
    <Layout
      title="FAQ — Часто задаваемые вопросы о строительстве каркасных домов"
      description="Ответы на популярные вопросы: сколько стоит, как долго строится, можно ли жить зимой, как оплатить. Получите бесплатную консультацию."
      canonical="/faq"
    >
      {/* Header */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl mb-3">Частые вопросы</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Собрали ответы на самые популярные вопросы о каркасном строительстве
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* FAQ List */}
          <div className="lg:col-span-2 space-y-8">
            {FAQ_CATEGORIES.map((cat) => (
              <div key={cat.category}>
                <h2 className="font-heading font-semibold text-xl mb-4 text-neutral-dark">{cat.category}</h2>
                <div className="space-y-3">
                  {cat.items.map((item, idx) => {
                    const key = `${cat.category}-${idx}`
                    const isOpen = openItem === key
                    return (
                      <div key={key} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggle(key)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-neutral-dark hover:bg-neutral-light transition-colors"
                        >
                          <span>{item.q}</span>
                          {isOpen ? <ChevronUp size={18} className="text-primary flex-shrink-0" /> : <ChevronDown size={18} className="flex-shrink-0" />}
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 text-sm text-neutral-medium leading-relaxed border-t border-gray-100 pt-3">
                            {item.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-20 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-lg mb-2">Не нашли ответа?</h3>
              <p className="text-neutral-medium text-sm mb-5">
                Задайте вопрос нашему специалисту — ответим в течение 30 минут
              </p>
              <CallForm />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
