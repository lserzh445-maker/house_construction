#!/usr/bin/env node
/**
 * Generates public/sitemap.xml at build time.
 * Hooked as "postbuild" in package.json so Vercel runs it automatically.
 */

const fs = require('fs')
const path = require('path')

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://domstroy.ru'

const STATIC_PAGES = [
  { path: '',             changefreq: 'weekly',  priority: '1.0' },
  { path: '/catalog',     changefreq: 'weekly',  priority: '0.9' },
  { path: '/calculator',  changefreq: 'monthly', priority: '0.8' },
  { path: '/about',       changefreq: 'monthly', priority: '0.7' },
  { path: '/contacts',    changefreq: 'monthly', priority: '0.7' },
  { path: '/blog',        changefreq: 'weekly',  priority: '0.7' },
  { path: '/reviews',     changefreq: 'weekly',  priority: '0.7' },
  { path: '/portfolio',   changefreq: 'monthly', priority: '0.6' },
  { path: '/services',    changefreq: 'monthly', priority: '0.6' },
  { path: '/financing',   changefreq: 'monthly', priority: '0.6' },
  { path: '/faq',         changefreq: 'monthly', priority: '0.5' },
  { path: '/promotions',  changefreq: 'weekly',  priority: '0.5' },
  { path: '/privacy',     changefreq: 'yearly',  priority: '0.2' },
]

const projectsPath = path.join(__dirname, '../src/data/projects.json')
const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'))

const today = new Date().toISOString().split('T')[0]

const staticUrls = STATIC_PAGES.map(
  ({ path: p, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
).join('\n')

const projectUrls = projects.map(
  ({ slug }) => `  <url>
    <loc>${SITE_URL}/projects/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${projectUrls}
</urlset>`

const outPath = path.join(__dirname, '../public/sitemap.xml')
fs.writeFileSync(outPath, xml, 'utf8')
console.log(`✅ sitemap.xml generated → ${outPath}`)
