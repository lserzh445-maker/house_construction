import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Home, BarChart2 } from 'lucide-react'
import { useCatalogStore } from '@/store/catalogStore'
import { formatPrice } from '@/utils/formatPrice'

export default function CompareBar() {
  const compare    = useCatalogStore((s) => s.compare)
  const remove     = useCatalogStore((s) => s.removeFromCompare)
  const clearAll   = useCatalogStore((s) => s.clearCompare)

  const compareIds = compare.map((p) => p.id).join(',')

  return (
    <AnimatePresence>
      {compare.length > 0 && (
        <motion.div
          key="compare-bar"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{   y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-xl"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Label */}
              <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-dark shrink-0">
                <BarChart2 size={16} className="text-secondary" />
                Сравнение ({compare.length}/4)
              </div>

              {/* Project thumbnails */}
              <div className="flex-1 flex gap-3 overflow-x-auto scrollbar-none">
                {compare.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-2 bg-neutral-light rounded-lg px-3 py-2 shrink-0"
                  >
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-200 shrink-0">
                      {project.images[0] ? (
                        <Image
                          src={project.images[0]}
                          alt={project.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                          <Home size={16} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-neutral-dark truncate max-w-[120px]">
                        {project.name}
                      </p>
                      <p className="text-xs text-primary font-semibold">
                        {formatPrice(project.price.basePrice)}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(project.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                      aria-label={`Убрать ${project.name} из сравнения`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {/* Placeholder slots */}
                {Array.from({ length: 4 - compare.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex items-center justify-center w-16 h-14 border-2 border-dashed border-gray-200 rounded-lg text-gray-300 shrink-0"
                  >
                    <Home size={18} />
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={clearAll}
                  className="text-sm text-neutral-medium hover:text-red-500 transition-colors whitespace-nowrap"
                >
                  Очистить
                </button>
                <Link
                  href={`/compare?ids=${compareIds}`}
                  className="btn-primary text-sm px-4 py-2 min-h-0 h-9 whitespace-nowrap"
                >
                  Сравнить
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
