import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface FaqItem {
  question: string
  answer: string
}

const DEFAULT_FAQ: FaqItem[] = [
  {
    question: 'Можно ли изменить планировку?',
    answer: 'Да, планировку можно адаптировать под ваши пожелания. Наш архитектор разработает изменённый проект бесплатно при заказе строительства.',
  },
  {
    question: 'Какой фундамент нужен под этот дом?',
    answer: 'Рекомендуем ленточный или свайно-ростверковый фундамент. Тип фундамента определяется после геологического исследования участка.',
  },
  {
    question: 'Можно ли строить зимой?',
    answer: 'Да, каркасное строительство ведётся круглогодично. Работы с бетоном выполняются с применением зимних технологий и тепляков.',
  },
  {
    question: 'Что входит в комплектацию «под ключ»?',
    answer: 'Фундамент, стены, кровля, окна, двери, наружная и внутренняя отделка, электропроводка, водоснабжение, канализация, система отопления.',
  },
  {
    question: 'Какая гарантия на дом?',
    answer: 'Гарантия на конструктив — 25 лет. На инженерные системы — 3 года. На кровельные материалы — 10 лет. Гарантия подтверждена договором.',
  },
  {
    question: 'Включена ли отделка в базовую цену?',
    answer: 'Нет. Базовая цена включает каркас, утепление, кровлю и фасад. Внутренняя отделка доступна в комплектациях «С отделкой» и «Под ключ».',
  },
  {
    question: 'Сколько времени занимает строительство?',
    answer: 'Срок зависит от площади и комплектации. Обычно от 2–3 недель для небольших домов до 8–10 недель для больших коттеджей «под ключ».',
  },
]

interface ProjectFAQProps {
  items?: FaqItem[]
}

export default function ProjectFAQ({ items = DEFAULT_FAQ }: ProjectFAQProps) {
  const [open, setOpen] = useState<number | null>(null)

  const toggle = (idx: number) => setOpen(open === idx ? null : idx)

  return (
    <section aria-labelledby="faq-title">
      <h2 id="faq-title" className="section-title mb-6">Часто задаваемые вопросы</h2>
      <div className="space-y-3 max-w-3xl">
        {items.map((item, idx) => (
          <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
              aria-expanded={open === idx}
            >
              <span className="pr-4">{item.question}</span>
              <ChevronDown
                size={18}
                className={cn('flex-shrink-0 transition-transform duration-200', open === idx && 'rotate-180')}
              />
            </button>
            {open === idx && (
              <div className="px-5 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
