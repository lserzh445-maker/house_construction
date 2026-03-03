import React from 'react'
import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  canonical?: string
  noindex?: boolean
  ogImage?: string
}

export default function Layout({
  children,
  title = 'Каркасные дома под ключ — строительство быстровозводимых домов',
  description = 'Строим каркасные дома под ключ за 4–6 недель. Более 870 построенных объектов. Гарантия 25 лет. Рассчитайте стоимость онлайн.',
  canonical,
  noindex = false,
  ogImage,
}: LayoutProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'ДомСтрой'

  return (
    <>
      <Head>
        <title>{title.includes(companyName) ? title : `${title} | ${companyName}`}</title>
        <meta name="description" content={description} />
        {noindex && <meta name="robots" content="noindex, nofollow" />}
        {canonical && <link rel="canonical" href={`${appUrl}${canonical}`} />}

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={companyName} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        {canonical && <meta property="og:url" content={`${appUrl}${canonical}`} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Schema.org LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: companyName,
              description: 'Строительство каркасных домов под ключ',
              telephone: process.env.NEXT_PUBLIC_PHONE,
              email: process.env.NEXT_PUBLIC_EMAIL,
              address: {
                '@type': 'PostalAddress',
                streetAddress: process.env.NEXT_PUBLIC_ADDRESS,
                addressLocality: 'Москва',
                addressCountry: 'RU',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '150',
                bestRating: '5',
              },
            }),
          }}
        />
      </Head>

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  )
}
