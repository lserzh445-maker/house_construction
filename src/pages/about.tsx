import React from 'react'
import Layout from '@/components/layout/Layout'
import CallForm from '@/components/forms/CallForm'
import { Award, Users, Building2, ThumbsUp } from 'lucide-react'

const TEAM = [
  { name: 'Алексей Петров', role: 'Генеральный директор', experience: '20 лет в строительстве' },
  { name: 'Мария Иванова', role: 'Главный архитектор', experience: '15 лет в проектировании' },
  { name: 'Сергей Козлов', role: 'Руководитель строительства', experience: '18 лет на объектах' },
  { name: 'Анна Смирнова', role: 'Менеджер по работе с клиентами', experience: '7 лет в сфере продаж' },
]

export default function AboutPage() {
  return (
    <Layout
      title="О компании — ДомСтрой | Строительство каркасных домов с 2007 года"
      description="ДомСтрой — строим каркасные дома с 2007 года. 870+ построенных объектов, команда 200+ специалистов, гарантия 25 лет на конструктив."
      canonical="/about"
    >
      {/* Hero */}
      <section className="bg-primary text-white section-padding">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">О компании</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            Строим каркасные дома с 2007 года. Мы превратили мечту о собственном доме в доступную реальность для тысяч семей.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Building2, value: '870+', label: 'Построенных домов' },
              { icon: Users, value: '200+', label: 'Специалистов в команде' },
              { icon: Award, value: '25 лет', label: 'Гарантия на конструктив' },
              { icon: ThumbsUp, value: '98%', label: 'Довольных клиентов' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <Icon size={32} className="text-primary mx-auto mb-3" />
                <p className="font-heading font-bold text-3xl text-primary mb-1">{value}</p>
                <p className="text-neutral-medium text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">Наша история</h2>
              <div className="space-y-4 text-neutral-medium leading-relaxed">
                <p>
                  Компания основана в 2007 году командой инженеров-строителей, увлечённых идеей
                  сделать качественное жильё доступным для каждой российской семьи.
                </p>
                <p>
                  Начав с небольших дачных домиков, мы постепенно вышли на рынок загородного
                  строительства и сегодня возводим полноценные жилые дома площадью от 50 до 300 м².
                </p>
                <p>
                  Наш секрет — строгий контроль качества на каждом этапе и использование
                  только сертифицированных материалов. Именно поэтому мы без страха даём гарантию
                  25 лет на конструктив.
                </p>
              </div>
            </div>
            <div className="bg-primary rounded-2xl p-8 text-white">
              <h3 className="font-heading font-semibold text-xl mb-6">Наши ценности</h3>
              <ul className="space-y-4">
                {[
                  ['Качество', 'Сертифицированные материалы и опытные мастера'],
                  ['Честность', 'Фиксированная цена в договоре без скрытых доплат'],
                  ['Скорость', 'Сдаём объекты в оговорённые сроки — всегда'],
                  ['Ответственность', 'Гарантийный паспорт и поддержка после сдачи'],
                ].map(([title, desc]) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="text-accent font-bold text-lg">✓</span>
                    <div>
                      <span className="font-semibold">{title}: </span>
                      <span className="text-primary-100">{desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-title">Наша команда</h2>
            <p className="section-subtitle mx-auto">Опытные профессионалы, влюблённые в своё дело</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, experience }) => (
              <div key={name} className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-base mb-1">{name}</h3>
                <p className="text-primary text-sm font-medium mb-1">{role}</p>
                <p className="text-neutral-medium text-xs">{experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="section-title">Хотите узнать больше?</h2>
            <p className="section-subtitle mb-8">Свяжитесь с нами — мы ответим на все вопросы</p>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <CallForm />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
