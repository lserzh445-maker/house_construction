import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen, MapPin, FileText, Layers,
  Hammer, Zap, PaintBucket, Key,
} from 'lucide-react'
import { fadeInUp, stagger, viewport } from '@/lib/animations'
import styles from './OrderProcess.module.css'

/* ─── Types ──────────────────────────────────────────────────────────── */
export interface OrderStep {
  step: number
  icon: React.ElementType
  title: string
  description: string
  duration?: string
}

export interface OrderProcessProps {
  steps?: OrderStep[]
  className?: string
}

/* ─── Default steps ──────────────────────────────────────────────────── */
const DEFAULT_STEPS: OrderStep[] = [
  {
    step: 1, icon: BookOpen,
    title: 'Выбор проекта',
    description: 'Подбираем дом из каталога или разрабатываем индивидуальный проект под ваш участок.',
    duration: '1–3 дня',
  },
  {
    step: 2, icon: MapPin,
    title: 'Выезд и замеры',
    description: 'Инженер приезжает на участок, делает замеры и геологию грунта. Бесплатно.',
    duration: '1–2 дня',
  },
  {
    step: 3, icon: FileText,
    title: 'Договор и смета',
    description: 'Фиксируем стоимость, сроки и комплектацию в официальном договоре.',
    duration: '1 день',
  },
  {
    step: 4, icon: Layers,
    title: 'Фундамент',
    description: 'Закладываем фундамент (ленточный, свайный или плита) под ваш тип грунта.',
    duration: '1–2 недели',
  },
  {
    step: 5, icon: Hammer,
    title: 'Стены и кровля',
    description: 'Монтируем каркас, устанавливаем стены, утеплитель и кровлю за 2–3 недели.',
    duration: '2–3 недели',
  },
  {
    step: 6, icon: Zap,
    title: 'Инженерные системы',
    description: 'Прокладываем электрику, водоснабжение, канализацию и систему отопления.',
    duration: '1–2 недели',
  },
  {
    step: 7, icon: PaintBucket,
    title: 'Отделка',
    description: 'Выполняем внешнюю и внутреннюю отделку по выбранному варианту комплектации.',
    duration: '1–2 недели',
  },
  {
    step: 8, icon: Key,
    title: 'Сдача дома',
    description: 'Подписываем акт, передаём ключи и гарантийный паспорт на 25 лет.',
    duration: '1 день',
  },
]

/* ─── Step item ──────────────────────────────────────────────────────── */
interface StepItemProps {
  step: OrderStep
  index: number
}

function StepItem({ step, index }: StepItemProps) {
  const Icon = step.icon
  const isLast = step.step === 8

  return (
    <motion.div
      variants={fadeInUp}
      className={`${styles.step} bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all duration-300`}
    >
      {/* Number + Duration row */}
      <div className="flex items-center justify-between mb-4">
        <div className={styles.stepNumber}>{step.step}</div>
        {step.duration && (
          <span className="text-xs text-neutral-medium bg-neutral-light px-2.5 py-1 rounded-full">
            {step.duration}
          </span>
        )}
      </div>

      {/* Icon */}
      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-3">
        <Icon size={20} className="text-primary" />
      </div>

      {/* Text */}
      <h3 className="font-heading font-semibold text-base mb-2">{step.title}</h3>
      <p className="text-neutral-medium text-sm leading-relaxed">{step.description}</p>

      {/* Final step highlight */}
      {isLast && (
        <div className="mt-3 pt-3 border-t border-primary-50 flex items-center gap-2 text-primary text-sm font-medium">
          <Key size={14} />
          <span>Ключи в ваших руках!</span>
        </div>
      )}
    </motion.div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function OrderProcess({ steps, className = '' }: OrderProcessProps) {
  const data = steps ?? DEFAULT_STEPS

  return (
    <section className={`section-padding bg-neutral-light ${className}`} aria-labelledby="process-title">
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
            Процесс работы
          </motion.span>
          <motion.h2 variants={fadeInUp} id="process-title" className="section-title mt-1">
            Как мы строим
          </motion.h2>
          <motion.p variants={fadeInUp} className="section-subtitle mx-auto">
            8 прозрачных шагов от выбора проекта до ключей в руках
          </motion.p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          variants={stagger(0.09)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className={styles.grid}
        >
          {data.map((step, index) => (
            <StepItem key={step.step} step={step} index={index} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-10"
        >
          <p className="text-neutral-medium text-sm mb-4">
            Среднее время строительства — <strong className="text-primary">4–6 недель</strong>
          </p>
          <Link href="/contacts" className="btn-primary">
            Начать строительство
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
