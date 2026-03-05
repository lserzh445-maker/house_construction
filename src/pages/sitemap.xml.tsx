/**
 * Dynamic sitemap — served at /sitemap.xml
 * Auto-includes all 18 projects from the data file.
 */
import { GetServerSideProps } from 'next'
import projects from '@/data/projects.json'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://domstroy.ru'

const STATIC_PAGES = [
  { path: '',           changefreq: 'weekly',   priority: '1.0' },
  { path: '/catalog',   changefreq: 'weekly',   priority: '0.9' },
  { path: '/calculator',changefreq: 'monthly',  priority: '0.8' },
  { path: '/about',     changefreq: 'monthly',  priority: '0.7' },
  { path: '/contacts',  changefreq: 'monthly',  priority: '0.7' },
  { path: '/blog',      changefreq: 'weekly',   priority: '0.7' },
  { path: '/reviews',   changefreq: 'weekly',   priority: '0.7' },
  { path: '/portfolio', changefreq: 'monthly',  priority: '0.6' },
  { path: '/services',  changefreq: 'monthly',  priority: '0.6' },
  { path: '/financing', changefreq: 'monthly',  priority: '0.6' },
  { path: '/faq',       changefreq: 'monthly',  priority: '0.5' },
  { path: '/promotions',changefreq: 'weekly',   priority: '0.5' },
  { path: '/privacy',   changefreq: 'yearly',   priority: '0.2' },
]

function buildSitemap(): string {
  const today = new Date().toISOString().split('T')[0]

  const staticUrls = STATIC_PAGES.map(
    ({ path, changefreq, priority }) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  ).join('')

  const projectUrls = (projects as { slug: string }[]).map(
    ({ slug }) => `
  <url>
    <loc>${SITE_URL}/projects/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
  ).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${projectUrls}
</urlset>`
}

// This component is never rendered — getServerSideProps writes the response directly.
export default function SitemapPage() {
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  res.write(buildSitemap())
  res.end()
  return { props: {} }
}
