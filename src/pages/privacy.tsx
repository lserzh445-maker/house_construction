import React from 'react'
import Layout from '@/components/layout/Layout'

export default function PrivacyPage() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'ДомСтрой'

  return (
    <Layout
      title="Политика конфиденциальности — ДомСтрой"
      description="Политика конфиденциальности и обработки персональных данных компании ДомСтрой."
      canonical="/privacy"
      noindex
    >
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="font-heading font-bold text-3xl mb-8">Политика конфиденциальности</h1>

        <div className="prose prose-sm max-w-none text-neutral-medium space-y-6">
          <p className="text-sm text-neutral-medium">Редакция от 01.03.2026</p>

          <section>
            <h2 className="font-heading font-semibold text-xl text-neutral-dark mb-3">1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности регулирует порядок обработки персональных данных
              пользователей сайта компании {companyName} в соответствии с Федеральным законом
              от 27.07.2006 № 152-ФЗ «О персональных данных».
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-neutral-dark mb-3">2. Состав персональных данных</h2>
            <p>Мы собираем следующие данные при заполнении форм:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Имя и фамилия</li>
              <li>Номер телефона</li>
              <li>Адрес электронной почты</li>
              <li>IP-адрес и данные об использовании сайта (cookie)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-neutral-dark mb-3">3. Цели обработки данных</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Обратная связь по заявке</li>
              <li>Предоставление консультаций</li>
              <li>Подготовка коммерческих предложений</li>
              <li>Улучшение качества сервиса</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-neutral-dark mb-3">4. Права пользователя</h2>
            <p>Вы вправе в любое время отозвать согласие на обработку данных, направив запрос на email:</p>
            <p className="font-medium text-neutral-dark mt-2">
              {process.env.NEXT_PUBLIC_EMAIL || 'info@yourcompany.ru'}
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl text-neutral-dark mb-3">5. Cookies</h2>
            <p>
              Сайт использует cookie-файлы для улучшения пользовательского опыта и аналитики.
              Вы можете отключить cookie в настройках браузера.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  )
}
