import React, { useState } from 'react'
import { CreditCard, Home, Percent, Calculator } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import CallForm from '@/components/forms/CallForm'
import { formatPrice } from '@/utils/formatPrice'

const BANKS = [
  { name: 'Сбербанк', logo: '🏦', rate: 'от 5.4%', term: 'до 30 лет', amount: 'до 60 млн ₽', url: 'https://domclick.ru' },
  { name: 'ВТБ', logo: '🏦', rate: 'от 5.7%', term: 'до 30 лет', amount: 'до 60 млн ₽', url: 'https://vtb.ru' },
  { name: 'Альфа-Банк', logo: '🏦', rate: 'от 6.1%', term: 'до 25 лет', amount: 'до 50 млн ₽', url: 'https://alfabank.ru' },
  { name: 'ДОМ.РФ', logo: '🏛', rate: 'от 5.0%', term: 'до 30 лет', amount: 'до 100 млн ₽', url: 'https://domrф.рф' },
]

export default function FinancingPage() {
  const [loanAmount, setLoanAmount] = useState(5000000)
  const [rate, setRate] = useState(6)
  const [years, setYears] = useState(20)

  const monthly = Math.round(
    (loanAmount * (rate / 100 / 12)) /
    (1 - Math.pow(1 + rate / 100 / 12, -years * 12))
  )

  return (
    <Layout
      title="Ипотека и кредит на каркасный дом — условия финансирования"
      description="Ипотека на каркасный дом от 5% годовых. Партнёры: Сбербанк, ВТБ, Альфа-Банк, ДОМ.РФ. Рассчитайте платёж онлайн."
      canonical="/financing"
    >
      {/* Header */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <CreditCard size={40} className="mx-auto mb-4 text-accent" />
          <h1 className="font-heading font-bold text-4xl mb-3">Финансирование</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Купите дом мечты в ипотеку или кредит на выгодных условиях
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Home, title: 'Ипотека', desc: 'Долгосрочный кредит на покупку/строительство дома под залог недвижимости. Ставка от 5% годовых на срок до 30 лет.', badge: 'Популярно' },
            { icon: CreditCard, title: 'Потребительский кредит', desc: 'Нецелевой кредит без залога для покупки дома или оплаты части стоимости. Срок до 7 лет.', badge: null },
            { icon: Percent, title: 'Рассрочка от компании', desc: 'Собственная рассрочка без банка на 6–12 месяцев. Первый взнос 50%. Без переплаты.', badge: 'Без банка' },
          ].map(({ icon: Icon, title, desc, badge }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              {badge && (
                <span className="badge bg-accent-50 text-accent-dark border border-accent-100 text-xs mb-3 inline-block">{badge}</span>
              )}
              <Icon size={28} className="text-primary mb-3" />
              <h2 className="font-heading font-semibold text-lg mb-2">{title}</h2>
              <p className="text-neutral-medium text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Mortgage Calculator */}
        <div className="bg-neutral-light rounded-2xl p-8 mb-12">
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Calculator size={24} className="text-primary" />
            Калькулятор ипотеки
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Сумма кредита: {formatPrice(loanAmount)}
                </label>
                <input
                  type="range"
                  min={1000000}
                  max={30000000}
                  step={500000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-neutral-medium mt-1">
                  <span>1 млн</span><span>30 млн</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Ставка: {rate}%</label>
                <input
                  type="range"
                  min={4}
                  max={20}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-neutral-medium mt-1">
                  <span>4%</span><span>20%</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Срок: {years} лет</label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-neutral-medium mt-1">
                  <span>1 год</span><span>30 лет</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center bg-white rounded-2xl p-8 shadow-sm w-full">
                <p className="text-neutral-medium text-sm mb-2">Ежемесячный платёж</p>
                <p className="font-heading font-bold text-4xl text-primary mb-4">
                  {formatPrice(monthly)}
                </p>
                <p className="text-sm text-neutral-medium">
                  Переплата: {formatPrice(monthly * years * 12 - loanAmount)}
                </p>
                <p className="text-sm text-neutral-medium">
                  Итого за {years} лет: {formatPrice(monthly * years * 12)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Banks */}
        <h2 className="section-title mb-6">Банки-партнёры</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {BANKS.map((bank) => (
            <div key={bank.name} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{bank.logo}</div>
              <h3 className="font-heading font-semibold text-base mb-3">{bank.name}</h3>
              <div className="space-y-1.5 text-sm text-neutral-medium">
                <p><span className="text-primary font-semibold">{bank.rate}</span> ставка</p>
                <p>Срок: {bank.term}</p>
                <p>Сумма: {bank.amount}</p>
              </div>
              <a
                href={bank.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline mt-4 w-full text-sm text-center min-h-0 h-9"
              >
                Узнать условия
              </a>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 text-white text-center">
          <h2 className="font-heading font-bold text-2xl mb-3">Помогаем получить ипотеку</h2>
          <p className="text-primary-100 mb-6 max-w-lg mx-auto">
            Наш ипотечный менеджер поможет выбрать лучшую программу и сопроводит сделку
          </p>
          <div className="max-w-sm mx-auto bg-white rounded-xl p-5">
            <CallForm />
          </div>
        </div>
      </div>
    </Layout>
  )
}
