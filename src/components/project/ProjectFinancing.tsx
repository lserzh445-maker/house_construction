import React, { useState } from 'react'
import Link from 'next/link'
import { CreditCard, Calculator } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

const BANKS = [
  { name: 'Сбер (ДомКлик)', rate: 'от 5.9% годовых', color: '#21A038', href: '/financing' },
  { name: 'ВТБ',            rate: 'от 6.5% годовых', color: '#009FDF', href: '/financing' },
  { name: 'Альфа-Банк',     rate: 'от 7.2% годовых', color: '#EF3124', href: '/financing' },
  { name: 'ДОМ.РФ',         rate: 'Господдержка',    color: '#1B5E20', href: '/financing' },
]

interface ProjectFinancingProps {
  price: number
}

export default function ProjectFinancing({ price }: ProjectFinancingProps) {
  const [term, setTerm]       = useState(20)
  const [rate, setRate]       = useState(6)
  const [downPct, setDownPct] = useState(20)

  const down       = Math.round(price * downPct / 100)
  const loan       = price - down
  const monthRate  = rate / 100 / 12
  const months     = term * 12
  const payment    = loan > 0
    ? Math.round(loan * monthRate * Math.pow(1 + monthRate, months) / (Math.pow(1 + monthRate, months) - 1))
    : 0

  return (
    <section aria-labelledby="financing-title" className="bg-gray-50 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard size={20} className="text-[#0288D1]" />
        <h2 id="financing-title" className="font-heading font-bold text-xl text-gray-800">
          Варианты финансирования
        </h2>
      </div>

      {/* Banks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {BANKS.map((bank) => (
          <Link
            key={bank.name}
            href={bank.href}
            className="flex flex-col items-center p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-center"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mb-2 text-white text-xs font-bold"
              style={{ backgroundColor: bank.color }}
            >
              {bank.name[0]}
            </div>
            <span className="text-xs font-semibold text-gray-700 leading-tight mb-1">{bank.name}</span>
            <span className="text-xs text-gray-400">{bank.rate}</span>
          </Link>
        ))}
      </div>

      {/* Mini calculator */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={16} className="text-[#1B5E20]" />
          <h3 className="font-semibold text-gray-800 text-sm">Калькулятор платежа</h3>
        </div>

        <div className="space-y-3 mb-4">
          <label className="block">
            <span className="text-xs text-gray-500 mb-1 block">Первоначальный взнос: {downPct}% ({formatPrice(down)})</span>
            <input
              type="range" min={10} max={60} step={5} value={downPct}
              onChange={(e) => setDownPct(Number(e.target.value))}
              className="w-full accent-[#1B5E20]"
            />
          </label>

          <label className="block">
            <span className="text-xs text-gray-500 mb-1 block">Ставка: {rate}%</span>
            <input
              type="range" min={4} max={20} step={0.5} value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-[#1B5E20]"
            />
          </label>

          <label className="block">
            <span className="text-xs text-gray-500 mb-1 block">Срок: {term} лет</span>
            <input
              type="range" min={5} max={30} step={5} value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className="w-full accent-[#1B5E20]"
            />
          </label>
        </div>

        <div className="flex items-center justify-between bg-[#1B5E20]/5 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-500">Платёж в месяц</p>
            <p className="font-heading font-bold text-xl text-[#1B5E20]">{formatPrice(payment)}</p>
          </div>
          <Link href="/financing" className="btn-secondary text-sm px-4 py-2 min-h-0 h-9">
            Подробнее
          </Link>
        </div>
      </div>
    </section>
  )
}
