import React from 'react'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import CallForm from '@/components/forms/CallForm'

export default function ContactsPage() {
  const phone = process.env.NEXT_PUBLIC_PHONE || '+7 (499) 123-45-67'
  const phoneRaw = process.env.NEXT_PUBLIC_PHONE_RAW || '74991234567'
  const email = process.env.NEXT_PUBLIC_EMAIL || 'info@yourcompany.ru'
  const address = process.env.NEXT_PUBLIC_ADDRESS || 'г. Москва, ул. Строителей, д. 1'
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/79991234567'
  const telegram = process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/yourcompany_bot'

  return (
    <Layout
      title="Контакты — ДомСтрой | Телефон, адрес, схема проезда"
      description="Контакты компании ДомСтрой: телефон, email, адрес офиса в Москве. Режим работы, карта проезда. Закажите бесплатную консультацию."
      canonical="/contacts"
    >
      {/* Header */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl mb-3">Контакты</h1>
          <p className="text-primary-100 text-lg">Свяжитесь с нами любым удобным способом</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="section-title text-xl mb-6">Наши контакты</h2>

            <div className="space-y-5 mb-8">
              <a
                href={`tel:${phoneRaw}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-100 hover:shadow-sm transition-all group"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone size={22} className="text-primary group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-neutral-medium mb-0.5">Телефон</p>
                  <p className="font-semibold text-neutral-dark">{phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-100 hover:shadow-sm transition-all group"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <Mail size={22} className="text-primary group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-neutral-medium mb-0.5">Email</p>
                  <p className="font-semibold text-neutral-dark">{email}</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={22} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-neutral-medium mb-0.5">Адрес офиса</p>
                  <p className="font-semibold text-neutral-dark">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock size={22} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-neutral-medium mb-0.5">Режим работы</p>
                  <p className="font-semibold text-neutral-dark">Пн–Пт: 9:00 – 20:00</p>
                  <p className="text-neutral-medium text-sm">Сб–Вс: 10:00 – 18:00</p>
                </div>
              </div>
            </div>

            {/* Messengers */}
            <h3 className="font-heading font-semibold text-base mb-4">Мессенджеры</h3>
            <div className="flex gap-3">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-medium text-sm hover:bg-green-500 transition-colors"
              >
                <MessageCircle size={20} />
                WhatsApp
              </a>
              <a
                href={telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white rounded-xl font-medium text-sm hover:bg-blue-400 transition-colors"
              >
                <Send size={20} />
                Telegram
              </a>
            </div>

            {/* Map placeholder */}
            <div className="mt-8 bg-neutral-light rounded-2xl aspect-video flex items-center justify-center text-neutral-medium">
              <div className="text-center">
                <MapPin size={32} className="mx-auto mb-2 text-primary" />
                <p className="text-sm">Карта загружается...</p>
                <p className="text-xs mt-1">{address}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="font-heading font-semibold text-xl mb-2">Заказать звонок</h2>
              <p className="text-neutral-medium text-sm mb-6">
                Оставьте заявку — мы перезвоним в течение 30 минут
              </p>
              <CallForm />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
