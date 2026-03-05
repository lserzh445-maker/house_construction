import Link from 'next/link'
import Head from 'next/head'
import { generateBreadcrumbSchema, BreadcrumbItem } from '@/lib/seo'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems: BreadcrumbItem[] = [{ label: 'Главная', href: '/' }, ...items]

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(allItems)) }}
        />
      </Head>

      <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {allItems.map((item, idx) => (
              <li key={item.href} className="flex items-center gap-2">
                {idx > 0 && <span className="text-gray-400" aria-hidden="true">›</span>}
                {idx === allItems.length - 1 ? (
                  <span className="text-gray-700 font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-[#1B5E20] hover:text-green-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  )
}
