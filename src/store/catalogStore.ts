import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project } from '@/types'

interface CatalogStore {
  /* ── Favorites (persisted) ──────────────────────────────────────────────── */
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean

  /* ── Compare (transient, max 4) ─────────────────────────────────────────── */
  compare: Project[]
  toggleCompare: (project: Project) => void
  removeFromCompare: (id: string) => void
  clearCompare: () => void
  isInCompare: (id: string) => boolean
}

export const useCatalogStore = create<CatalogStore>()(
  persist(
    (set, get) => ({
      /* Favorites */
      favorites: [],
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),

      /* Compare */
      compare: [],
      toggleCompare: (project) =>
        set((s) => {
          if (s.compare.some((p) => p.id === project.id)) {
            return { compare: s.compare.filter((p) => p.id !== project.id) }
          }
          if (s.compare.length >= 4) return s
          return { compare: [...s.compare, project] }
        }),
      removeFromCompare: (id) =>
        set((s) => ({ compare: s.compare.filter((p) => p.id !== id) })),
      clearCompare: () => set({ compare: [] }),
      isInCompare: (id) => get().compare.some((p) => p.id === id),
    }),
    {
      name: 'catalog-store',
      partialize: (s) => ({ favorites: s.favorites }), // only favorites survive refresh
    },
  ),
)
