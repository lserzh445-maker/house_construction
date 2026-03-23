'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Calculator, ChevronDown, MessageCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import CallForm from '@/components/forms/CallForm'
import { fadeIn } from '@/lib/animations'
import styles from './HeroSection.module.css'

/* ─── Props ──────────────────────────────────────────────────────────── */
interface HeroSectionProps {
  title?: string
  subtitle?: string
}

/* ─── Stat item ──────────────────────────────────────────────────────── */
const STATS = [
  { value: '17+', label: 'лет опыта' },
  { value: '870+', label: 'построенных домов' },
  { value: '25 лет', label: 'гарантия' },
  { value: '98%', label: 'довольных клиентов' },
]

/* ─── Headline words ─────────────────────────────────────────────────── */
const wordVariant = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08 + 0.3, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

/* ─── Component ──────────────────────────────────────────────────────── */
export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  const [showForm, setShowForm] = useState(false)

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/79991234567'
  const phone    = process.env.NEXT_PUBLIC_PHONE_RAW   || '74991234567'

  const headline = (title ?? 'Постройте дом мечты за 4–6 недель').split(' ')

  return (
    <section className={styles.hero} aria-label="Главный баннер">
      {/* Background */}
      <div className={styles.heroBg} aria-hidden />
      <div className={styles.overlay} aria-hidden />

      {/* ─── Main content ─── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container mx-auto px-4 py-20 text-center text-white">
          <div className="max-w-3xl mx-auto">

            {/* Badge */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
              <Badge variant="ghost" className="text-sm px-5 py-2 mb-6">
                🏠 Строим каркасные дома с 2007 года
              </Badge>
            </motion.div>

            {/* H1 — word-by-word reveal */}
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              {headline.map((word, i) => {
                const isAccent = word.includes('4–6') || word.includes('мечты')
                return (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={wordVariant}
                    initial="hidden"
                    animate="visible"
                    className={`inline-block mr-[0.25em] ${isAccent ? 'text-accent' : ''}`}
                  >
                    {word}
                  </motion.span>
                )
              })}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-200 mb-5 leading-relaxed"
            >
              {subtitle ?? 'Каркасные дома под ключ с гарантией 25 лет. Качество, скорость и честная цена от производителя.'}
            </motion.p>

            {/* Trust pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex flex-wrap justify-center gap-4 mb-10 text-sm text-gray-300"
            >
              {['✓ Гарантия 25 лет', '✓ Строим под ключ', '✓ Доставка по России', '✓ Ипотека от 5%'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </motion.div>

            {/* ─── CTA ─── */}
            <AnimatePresence mode="wait">
              {!showForm ? (
                <motion.div
                  key="buttons"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <button
                    onClick={() => setShowForm(true)}
                    className={`btn-accent text-base px-8 py-4 min-h-[56px] shadow-xl ${styles.glowBtn}`}
                  >
                    <Phone size={20} />
                    Заказать звонок
                  </button>

                  <Link
                    href="/catalog"
                    className="btn-outline border-white text-white hover:bg-white hover:text-primary text-base px-8 py-4 min-h-[56px]"
                  >
                    Смотреть каталог
                  </Link>

                  <Link
                    href="/calculator"
                    className="inline-flex items-center justify-center gap-2 text-base px-6 py-4 min-h-[56px] text-white/75 hover:text-white transition-colors"
                  >
                    <Calculator size={18} />
                    Калькулятор стоимости
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto border border-white/20"
                >
                  <h2 className="font-heading font-semibold text-xl mb-4 text-white">
                    Заказать звонок
                  </h2>
                  <CallForm onSuccess={() => setShowForm(false)} />
                  <button
                    onClick={() => setShowForm(false)}
                    className="mt-3 text-sm text-gray-400 hover:text-white transition-colors w-full"
                  >
                    Отмена
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messenger links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-8 flex items-center justify-center gap-5"
            >
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <span className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle size={14} />
                </span>
                WhatsApp
              </a>
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <span className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                  <Phone size={13} />
                </span>
                Позвонить
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── Stats bar ─── */}
      <motion.div
        className={`relative z-10 w-full ${styles.statsBar}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center flex-wrap gap-0 py-4">
            {STATS.map((stat, idx) => (
              <React.Fragment key={stat.label}>
                {idx > 0 && <div className={styles.statDivider} />}
                <div className="px-6 text-center">
                  <p className="font-heading font-bold text-xl md:text-2xl text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll arrow */}
      <a
        href="#about"
        aria-label="Прокрутить вниз"
        className={`absolute bottom-20 left-1/2 text-white/50 hover:text-white transition-colors z-20 ${styles.scrollArrow}`}
        style={{ transform: 'translateX(-50%)' }}
      >
        <ChevronDown size={30} />
      </a>
    </section>
  )
}
