import React from 'react'
import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'
import { generateLocalBusinessSchema } from '@/lib/seo'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  canonical?: string
  noindex?: boolean
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  jsonLd?: object | object[]
}

export default function Layout({
  children,
  title = 'Каркасные дома под ключ — строительство быстровозводимых домов',
  description = 'Строим каркасные дома под ключ за 4–6 недель. Более 870 построенных объектов. Гарантия 25 лет. Рассчитайте стоимость онлайн.',
  canonical,
  noindex = false,
  ogImage,
  ogType = 'website',
  jsonLd,
}: LayoutProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://domstroy.ru'
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'ДомСтрой'

  const fullTitle = title.includes(companyName) ? title : `${title} | ${companyName}`
  const canonicalUrl = canonical ? `${appUrl}${canonical}` : undefined

  // Extra JSON-LD blocks passed from individual pages (product, breadcrumb, faq, etc.)
  const extraSchemas = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    : []

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        {noindex && <meta name="robots" content="noindex, nofollow" />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content={companyName} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Schema.org LocalBusiness (site-wide) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateLocalBusinessSchema()) }}
        />

        {/* Page-specific JSON-LD (product, breadcrumb, faq, …) */}
        {extraSchemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </Head>

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  )
}
