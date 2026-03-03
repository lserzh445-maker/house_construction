import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { fadeInLeft, fadeInRight, stagger, fadeInUp, viewport } from '@/lib/animations'

/* ─── Props ──────────────────────────────────────────────────────────── */
export interface CompanyAboutProps {
  className?: string
}

/* ─── CountUp hook ───────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 2000, started = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    const startTime = performance.now()
    let raf: number
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, started])
  return count
}

/* ─── Stat card ──────────────────────────────────────────────────────── */
interface StatCardProps {
  target: number
  suffix: string
  label: string
  started: boolean
}

function StatCard({ target, suffix, label, started }: StatCardProps) {
  const count = useCountUp(target, 2200, started)
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white/10 rounded-2xl p-6 text-center border border-white/15 backdrop-blur-sm"
    >
      <p className="font-heading font-bold text-4xl mb-1 text-white">
        {count}{suffix}
      </p>
      <p className="text-primary-100 text-sm">{label}</p>
    </motion.div>
  )
}

/* ─── Component ──────────────────────────────────────────────────────── */
const CHECKPOINTS = [
  'Официальный договор с фиксированной стоимостью',
  'Гарантийный паспорт на конструктив 25 лет',
  'Поэтапные фото и видеоотчёты с объекта',
  'Постгарантийное обслуживание и консультации',
]

const STATS = [
  { target: 17, suffix: '+', label: 'Лет на рынке' },
  { target: 870, suffix: '+', label: 'Построенных домов' },
  { target: 25, suffix: '', label: 'Лет гарантии' },
  { target: 98, suffix: '%', label: 'Довольных клиентов' },
]

export default function CompanyAbout({ className = '' }: CompanyAboutProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.35 })

  return (
    <section
      id="about"
      className={`bg-primary section-padding ${className}`}
      aria-labelledby="about-title"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ─── Left: text ─── */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="text-white"
          >
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              О компании
            </span>
            <h2
              id="about-title"
              className="font-heading font-bold text-3xl md:text-4xl mb-5 leading-tight"
            >
              17+ лет строим дома,<br className="hidden sm:block" /> которым доверяют
            </h2>

            <div className="space-y-4 text-primary-100 leading-relaxed mb-7">
              <p>
                С 2007 года мы помогаем семьям воплощать мечту о собственном загородном доме.
                Наши каркасные дома строятся быстрее, стоят дешевле и служат дольше, чем большинство
                альтернатив.
              </p>
              <p>
                За 17 лет мы выработали систему, при которой каждый клиент получает именно то,
                что было обещано — в оговорённые сроки и по зафиксированной цене.
              </p>
            </div>

            {/* Checkpoints */}
            <motion.ul
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="space-y-3 mb-8"
            >
              {CHECKPOINTS.map((item) => (
                <motion.li
                  key={item}
                  variants={fadeInUp}
                  className="flex items-start gap-3 text-sm text-primary-100"
                >
                  <CheckCircle2 size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-white font-semibold border-2 border-white/30 rounded-xl px-6 py-3 hover:bg-white hover:text-primary transition-colors duration-200"
            >
              Подробнее о компании
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* ─── Right: stats grid ─── */}
          <div ref={ref}>
            <motion.div
              variants={stagger(0.12)}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="grid grid-cols-2 gap-4"
            >
              {STATS.map((s) => (
                <StatCard key={s.label} {...s} started={isInView} />
              ))}
            </motion.div>

            {/* Badge */}
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="mt-4 bg-accent/15 border border-accent/30 rounded-2xl p-4 text-center"
            >
              <p className="text-white font-semibold text-sm">
                🏆 Лидер рейтинга каркасных домов Московской области 2025
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
