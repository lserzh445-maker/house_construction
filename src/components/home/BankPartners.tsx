import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Percent } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { fadeInUp, stagger, viewport } from '@/lib/animations'

/* ─── Types ──────────────────────────────────────────────────────────── */
export interface BankPartner {
  name: string
  color: string
  rate: string
  term: string
  program: string
  url: string
}

export interface BankPartnersProps {
  partners?: BankPartner[]
  className?: string
}

/* ─── Default partners ───────────────────────────────────────────────── */
const DEFAULT_PARTNERS: BankPartner[] = [
  { name: 'Сбер', color: '#1FAD34', rate: 'от 5.4%', term: 'до 30 лет', program: 'ДомКлик', url: 'https://domclick.ru' },
  { name: 'ВТБ',  color: '#0A3A8F', rate: 'от 5.7%', term: 'до 30 лет', program: 'Ипотека ВТБ', url: 'https://vtb.ru' },
  { name: 'Альфа', color: '#EF3124', rate: 'от 6.1%', term: 'до 25 лет', program: 'АльфаДом', url: 'https://alfabank.ru' },
  { name: 'ДОМ.РФ', color: '#0033A0', rate: 'от 5.0%', term: 'до 30 лет', program: 'Господдержка', url: 'https://xn--d1aqf.xn--p1ai' },
]

/* ─── Component ──────────────────────────────────────────────────────── */
export default function BankPartners({ partners, className = '' }: BankPartnersProps) {
  const data = partners ?? DEFAULT_PARTNERS

  return (
    <section className={`section-padding bg-white ${className}`} aria-labelledby="financing-title">
      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: text */}
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-3">
              <Percent size={18} className="text-accent" />
              <span className="text-accent font-semibold text-sm uppercase tracking-widest">Финансирование</span>
            </motion.div>

            <motion.h2 variants={fadeInUp} id="financing-title" className="section-title">
              Ипотека и кредит на дом
            </motion.h2>

            <motion.p variants={fadeInUp} className="section-subtitle mb-6">
              Мы сотрудничаем с ведущими банками России. Наш ипотечный менеджер поможет
              выбрать лучшие условия и сопроводит сделку.
            </motion.p>

            <motion.ul variants={stagger(0.08)} className="space-y-3 mb-7">
              {[
                'Ипотека без первоначального взноса — от 5%',
                'Одобрение за 1 рабочий день',
                'Принимаем материнский капитал',
                'Помогаем с документами бесплатно',
              ].map((item) => (
                <motion.li
                  key={item}
                  variants={fadeInUp}
                  className="flex items-center gap-3 text-sm text-neutral-dark"
                >
                  <span className="w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center text-primary text-xs flex-shrink-0">✓</span>
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeInUp}>
              <Link href="/financing" className="btn-primary inline-flex">
                Условия финансирования
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: bank cards */}
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="grid grid-cols-2 gap-4"
          >
            {data.map((bank) => (
              <motion.a
                key={bank.name}
                variants={fadeInUp}
                href={bank.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-neutral-light rounded-2xl p-5 border-2 border-transparent hover:border-primary-200 hover:shadow-md transition-all duration-300"
              >
                {/* Bank logo (color block) */}
                <div
                  className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: bank.color }}
                >
                  {bank.name.slice(0, 2)}
                </div>

                <p className="font-heading font-semibold text-base mb-1 text-neutral-dark group-hover:text-primary transition-colors">
                  {bank.name}
                </p>
                <p className="text-2xl font-bold text-primary font-heading mb-0.5">{bank.rate}</p>
                <p className="text-xs text-neutral-medium mb-2">Срок: {bank.term}</p>
                <Badge variant="muted" className="text-[11px]">{bank.program}</Badge>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
