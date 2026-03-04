import useSWR from 'swr'
import type { CatalogParams, CatalogResult } from '@/lib/catalogFilter'
import { buildCatalogUrl } from '@/lib/catalogFilter'

const fetcher = (url: string): Promise<CatalogResult> =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('Failed to fetch catalog')
    return r.json()
  })

export function useCatalog(params: CatalogParams, fallbackData?: CatalogResult) {
  const key = buildCatalogUrl(params)
  return useSWR<CatalogResult>(key, fetcher, {
    fallbackData,
    keepPreviousData: true,
    revalidateOnFocus: false,
  })
}

export { buildCatalogUrl }
export type { CatalogParams, CatalogResult }
