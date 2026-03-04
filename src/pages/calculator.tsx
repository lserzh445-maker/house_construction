import React, { useState } from 'react'
import Link from 'next/link'
import * as Accordion from '@radix-ui/react-accordion'
import { Calculator as CalculatorIcon, ChevronDown, Phone } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import CalculatorComponent from '@/components/Calculator'
import FormModal from '@/components/modals/FormModal'

/* ─── FAQ data ───────────────────────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    q: 'Может ли цена отличаться от рассчитанной в калькуляторе?',
    a: 'Да, смета является предварительной и может измениться в зависимости от условий участка, рельефа, типа фундамента и дополнительных пожеланий. Для точного расчёта свяжитесь с менеджером через кнопку «Узнать точную цену».',
  },
  {
    q: 'Входит ли доставка в базовую стоимость?',
    a: 'Нет, доставка — опциональная услуга (+50 000 ₽). Она рассчитана для радиуса до 500 км от нашего производства. Для большего расстояния стоимость уточняется индивидуально.',
  },
  {
    q: 'Какие варианты финансирования доступны?',
    a: 'Мы работаем с ведущими банками: Сбер (ДомКлик), ВТБ, Альфа-Банк, ДОМ.РФ. Ставки по ипотеке — от 8% годовых, срок — 15–20 лет. Для семей с детьми доступна семейная ипотека от 5%.',
  },
  {
    q: 'Что входит в комплектацию «Под ключ»?',
    a: '«Под ключ» включает силовой каркас, кровлю, окна и двери, чистовую внутреннюю отделку, инженерные системы (электрика, водоснабжение, отопление), а также базовую меблировку — дом готов к заезду.',
  },
  {
    q: 'Сколько времени занимает строительство?',
    a: 'Стандартный срок строительства — 4–6 недель с момента подписания договора и внесения предоплаты. Проекты с индивидуальной планировкой могут занять до 8 недель.',
  },
  {
    q: 'Какую гарантию вы даёте?',
    a: 'На силовой каркас — 25 лет, на строительно-монтажные работы — 3 года. Гарантия действует при соблюдении условий эксплуатации, описанных в договоре.',
  },
]

/* ─── Page component ─────────────────────────────────────────────────────── */

export default function CalculatorPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Layout
      title="Онлайн-калькулятор стоимости каркасного дома | ДомСтрой"
      description="Рассчитайте стоимость каркасного дома онлайн: выберите проект, комплектацию и опции — PDF-смета скачивается автоматически."
      canonical="/calculator"
    >
      {/* ── Breadcrumb ── */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#1B5E20] transition-colors">Главная</Link>
          <span>›</span>
          <span className="text-gray-800">Калькулятор стоимости</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="bg-[#1B5E20] text-white py-14">
        <div className="container mx-auto px-4 text-center">
          <CalculatorIcon size={44} className="mx-auto mb-4 text-[#FF9100]" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4 leading-tight">
            Калькулятор стоимости
          </h1>
          <p className="text-green-200 text-lg max-w-xl mx-auto">
            Выберите проект, комплектацию и опции — итог обновляется в реальном времени.
            PDF-смета скачивается автоматически.
          </p>
        </div>
      </section>

      {/* ── Calculator ── */}
      <section className="container mx-auto px-4 py-12">
        <CalculatorComponent />
      </section>

      {/* ── FAQ ── */}
      <section className="bg-gray-50 border-t border-gray-100 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-800 mb-2 text-center">
            Часто задаваемые вопросы
          </h2>
          <p className="text-gray-500 text-center mb-10">
            О расчётах, сметах и вариантах финансирования
          </p>

          <Accordion.Root type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map(({ q, a }, idx) => (
              <Accordion.Item
                key={idx}
                value={`item-${idx}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <Accordion.Trigger
                  className={[
                    'w-full flex items-center justify-between gap-4 px-5 py-4',
                    'text-left font-semibold text-gray-800 text-sm md:text-base',
                    'hover:bg-gray-50 transition-colors outline-none',
                    'data-[state=open]:bg-green-50 data-[state=open]:text-[#1B5E20]',
                    'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1B5E20]',
                    '[&>svg]:data-[state=open]:rotate-180',
                  ].join(' ')}
                >
                  {q}
                  <ChevronDown
                    size={18}
                    className="flex-shrink-0 text-gray-400 transition-transform duration-200"
                  />
                </Accordion.Trigger>

                <Accordion.Content className="overflow-hidden text-sm text-gray-600 leading-relaxed">
                  <div className="px-5 pb-5 pt-1 border-t border-gray-100">{a}</div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1B5E20] py-16">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <p className="text-green-300 text-sm font-semibold uppercase tracking-widest mb-3">
            Нужна помощь?
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Уточните стоимость у менеджера
          </h2>
          <p className="text-green-200 mb-8">
            Получите персональный расчёт с учётом особенностей вашего участка.
            Отвечаем в течение 30 минут.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#FF9100] hover:bg-orange-500 text-white font-semibold px-10 py-4 rounded-xl transition-colors min-h-[56px] inline-flex items-center gap-2 text-base"
          >
            <Phone size={20} />
            Узнать точную цену
          </button>
          <p className="text-green-400 text-sm mt-5">
            17+ лет опыта · 870+ домов · Гарантия 25 лет
          </p>
        </div>
      </section>

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formType="quote"
      />
    </Layout>
  )
}
