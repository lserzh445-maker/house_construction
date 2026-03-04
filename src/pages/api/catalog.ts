/**
 * GET /api/catalog
 *
 * Filters, sorts and paginates projects from /src/data/projects.json.
 * Replace with a real Prisma/DB query when the backend is connected.
 *
 * Query params:
 *   floors        1 | 2 | mansard
 *   area_from     number (m²)
 *   area_to       number (m²)
 *   price_from    number (₽)
 *   price_to      number (₽)
 *   style         comma-separated: finnish,canadian,modern,barnhouse
 *   features      comma-separated: terrace,sauna,garage,balcony,boiler-room
 *   sort          popularity | price_asc | price_desc | area_asc | area_desc
 *   page          number (default 1)
 *   page_size     number (default 12, max 50)
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { filterCatalog, type CatalogParams } from '@/lib/catalogFilter'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    floors,
    area_from, area_to,
    price_from, price_to,
    style,
    features,
    sort,
    page,
    page_size,
  } = req.query

  const params: CatalogParams = {
    floors:     typeof floors     === 'string' ? floors     : undefined,
    area_from:  area_from  ? Number(area_from)  : undefined,
    area_to:    area_to    ? Number(area_to)    : undefined,
    price_from: price_from ? Number(price_from) : undefined,
    price_to:   price_to   ? Number(price_to)   : undefined,
    style:      style    ? String(style).split(',').filter(Boolean)    : undefined,
    features:   features ? String(features).split(',').filter(Boolean) : undefined,
    sort:       typeof sort      === 'string' ? sort      : undefined,
    page:       page      ? Number(page)      : undefined,
    page_size:  page_size ? Number(page_size) : undefined,
  }

  const result = filterCatalog(params)

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  res.json(result)
}
