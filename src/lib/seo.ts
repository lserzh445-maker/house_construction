/**
 * SEO helpers — Schema.org JSON-LD structured data generators.
 * Used in pages/Layout to inject <script type="application/ld+json">.
 */

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://domstroy.ru'
const COMPANY  = process.env.NEXT_PUBLIC_COMPANY_NAME || 'ДомСтрой'
const PHONE    = process.env.NEXT_PUBLIC_PHONE || '+7 (499) 123-45-67'
const EMAIL    = process.env.NEXT_PUBLIC_EMAIL || 'info@domstroy.ru'
const ADDRESS  = process.env.NEXT_PUBLIC_ADDRESS || 'ул. Строителей, д. 1, офис 101'

// ─── Organization ─────────────────────────────────────────────────────────────

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Каркасные дома под ключ с 2007 года. Проектирование, производство и монтаж.',
    telephone: PHONE,
    email: EMAIL,
    sameAs: [
      'https://www.youtube.com/domstroy',
      'https://vk.com/domstroy',
      'https://t.me/domstroy',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS,
      addressLocality: 'Москва',
      postalCode: '123456',
      addressCountry: 'RU',
    },
  }
}

// ─── LocalBusiness ────────────────────────────────────────────────────────────

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': SITE_URL,
    name: COMPANY,
    image: `${SITE_URL}/og-image.jpg`,
    description: 'Строительство каркасных домов под ключ',
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS,
      addressLocality: 'Москва',
      postalCode: '123456',
      addressCountry: 'RU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 55.7558,
      longitude: 37.6173,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
      bestRating: '5',
    },
    priceRange: '₽₽₽',
  }
}

// ─── Product (project card) ───────────────────────────────────────────────────

export interface ProjectForSchema {
  id: string
  slug: string
  name: string
  description: string
  images?: string[]
  price?: { basePrice?: number }
  rating?: number
  reviewCount?: number
}

export function generateProductSchema(project: ProjectForSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: project.name,
    description: project.description?.slice(0, 250),
    image: project.images?.[0],
    brand: { '@type': 'Brand', name: COMPANY },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/projects/${project.slug}`,
      priceCurrency: 'RUB',
      price: project.price?.basePrice,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: COMPANY },
    },
    ...(project.rating && project.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: project.rating,
            reviewCount: project.reviewCount,
            bestRating: 5,
          },
        }
      : {}),
  }
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string
  href: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  }
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export function generateFAQSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}
