import React from 'react'
import { motion } from 'framer-motion'
import {
  Clock, Shield, Star, Truck, Home, CreditCard,
  Wrench, Leaf,
} from 'lucide-react'
import { fadeInUp, stagger, viewport } from '@/lib/animations'

/* ─── Props ──────────────────────────────────────────────────────────── */
export interface Advantage {
  icon: React.ElementType
  title: string
  description: string
  accent?: boolean
}

export interface AdvantagesProps {
  items?: Advantage[]
  className?: string
}

/* ─── Default data ───────────────────────────────────────────────────── */
const DEFAULT_ADVANTAGES: Advantage[] = [
  {
    icon: Clock,
    title: 'Быстрое строительство',
    description: 'Готовый дом за 4–6 недель — в 3 раза быстрее, чем из кирпича или газобетона.',
    accent: true,
  },
  {
    icon: Shield,
    title: 'Гарантия 25 лет',
    description: 'Официальный гарантийный паспорт на конструктив дома с полным описанием условий.',
  },
  {
    icon: Star,
    title: '870+ построенных домов',
    description: 'За 17 лет сдали более 870 объектов по всей России. Каждый — в срок и по смете.',
  },
  {
    icon: Truck,
    title: 'Доставка по всей России',
    description: 'Привезём материалы и пришлём бригаду в любой регион. Работаем от Калининграда до Владивостока.',
  },
  {
    icon: Home,
    title: 'Строительство под ключ',
    description: 'Берём на себя весь цикл: проект, фундамент, стены, кровля, инженерия, отделка.',
  },
  {
    icon: CreditCard,
    title: 'Ипотека от 5%',
    description: 'Помогаем оформить ипотеку через Сбер, ВТБ, Альфа-Банк и ДОМ.РФ. Без отказов.',
  },
  {
    icon: Wrench,
    title: 'Фиксированная цена',
    description: 'Цена прописана в договоре и не меняется. Никаких скрытых доплат и сюрпризов.',
  },
  {
    icon: Leaf,
    title: 'Экологичные материалы',
    description: 'Используем сертифицированные материалы. Безопасно для детей, аллергиков и природы.',
  },
]

/* ─── Component ──────────────────────────────────────────────────────── */
export default function Advantages({ items, className = '' }: AdvantagesProps) {
  const data = items ?? DEFAULT_ADVANTAGES

  return (
    <section className={`section-padding bg-white ${className}`} aria-labelledby="advantages-title">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-12"
        >
          <motion.span variants={fadeInUp} className="text-accent font-semibold text-sm uppercase tracking-widest">
            Почему мы
          </motion.span>
          <motion.h2 variants={fadeInUp} id="advantages-title" className="section-title mt-1">
            Почему выбирают ДомСтрой
          </motion.h2>
          <motion.p variants={fadeInUp} className="section-subtitle mx-auto">
            17 лет строим каркасные дома, которые служат поколениями
          </motion.p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {data.map(({ icon: Icon, title, description, accent }) => (
            <motion.div
              key={title}
              variants={fadeInUp}
              className={`group relative flex flex-col gap-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-default
                ${accent
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-100 bg-white hover:border-primary-200 hover:shadow-lg'
                }`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                  ${accent
                    ? 'bg-white/20'
                    : 'bg-primary-50 group-hover:bg-primary group-hover:text-white transition-colors duration-300'
                  }`}
              >
                <Icon
                  size={24}
                  className={accent
                    ? 'text-white'
                    : 'text-primary group-hover:text-white transition-colors duration-300'
                  }
                />
              </div>

              {/* Text */}
              <div>
                <h3 className={`font-heading font-semibold text-base mb-1.5 ${accent ? 'text-white' : 'text-neutral-dark'}`}>
                  {title}
                </h3>
                <p className={`text-sm leading-relaxed ${accent ? 'text-white/80' : 'text-neutral-medium'}`}>
                  {description}
                </p>
              </div>

              {/* Accent corner mark */}
              {accent && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
