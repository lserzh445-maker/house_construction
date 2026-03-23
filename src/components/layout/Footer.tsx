import React from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react'

const catalogLinks = [
  { label: 'Все проекты',       href: '/catalog' },
  { label: 'Одноэтажные дома',  href: '/catalog?floors=1' },
  { label: 'Двухэтажные дома',  href: '/catalog?floors=2' },
  { label: 'С мансардой',       href: '/catalog?floors=mansard' },
  { label: 'Финские дома',      href: '/catalog?style=finnish' },
  { label: 'Коттеджи',          href: '/catalog?style=canadian' },
]

const companyLinks = [
  { label: 'О компании', href: '/about' },
  { label: 'Портфолио', href: '/portfolio' },
  { label: 'Отзывы', href: '/reviews' },
  { label: 'Акции', href: '/promotions' },
  { label: 'Блог', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
]

const serviceLinks = [
  { label: 'Услуги', href: '/services' },
  { label: 'Финансирование', href: '/financing' },
  { label: 'Калькулятор', href: '/calculator' },
  { label: 'Контакты', href: '/contacts' },
  { label: 'Политика конфиденциальности', href: '/privacy' },
  { label: 'Условия использования', href: '/terms' },
]

export default function Footer() {
  const phone = process.env.NEXT_PUBLIC_PHONE || '+7 (499) 123-45-67'
  const phoneRaw = process.env.NEXT_PUBLIC_PHONE_RAW || '74991234567'
  const email = process.env.NEXT_PUBLIC_EMAIL || 'info@yourcompany.ru'
  const address = process.env.NEXT_PUBLIC_ADDRESS || 'г. Москва, ул. Строителей, д. 1'
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/79991234567'
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/yourcompany_bot'
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'ДомСтрой'

  return (
    <footer className="bg-neutral-dark text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Д</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">{companyName}</span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Строим каркасные дома под ключ с 2007 года. Более 870 построенных объектов.
              Гарантия 25 лет на конструктив.
            </p>

            {/* Social / Messengers */}
            <div className="flex gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-500 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors"
                aria-label="Telegram"
              >
                <Send size={20} />
              </a>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-4">Каталог</h3>
            <ul className="space-y-2">
              {catalogLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-4">Компания</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${phoneRaw}`}
                  className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                >
                  <Phone size={16} className="text-primary flex-shrink-0" />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                >
                  <Mail size={16} className="text-primary flex-shrink-0" />
                  {email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-gray-400 text-sm">
                  <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-gray-500 text-xs mb-2">Режим работы:</p>
              <p className="text-gray-400 text-sm">Пн–Пт: 9:00 – 20:00</p>
              <p className="text-gray-400 text-sm">Сб–Вс: 10:00 – 18:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} {companyName}. Все права защищены.
          </p>
          <div className="flex gap-4">
            {serviceLinks.slice(-2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-500 text-xs hover:text-gray-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
