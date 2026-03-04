import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Bed, Home, ArrowRight, BarChart2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatPrice, formatArea } from '@/utils/formatPrice'
import { useCatalogStore } from '@/store/catalogStore'
import type { Project } from '@/types'

interface ProductCardProps {
  project: Project
}

export default function ProductCard({ project }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)

  const isFavorite  = useCatalogStore((s) => s.isFavorite(project.id))
  const isInCompare = useCatalogStore((s) => s.isInCompare(project.id))
  const compareLen  = useCatalogStore((s) => s.compare.length)
  const toggleFav   = useCatalogStore((s) => s.toggleFavorite)
  const toggleCmp   = useCatalogStore((s) => s.toggleCompare)

  const compareDisabled = !isInCompare && compareLen >= 4

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleFav(project.id)
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!compareDisabled) toggleCmp(project)
  }

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div
        className={cn(
          'card h-full flex flex-col transition-shadow duration-200',
          isInCompare && 'ring-2 ring-secondary',
        )}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-light">
          {!imgError && project.images[0] ? (
            <Image
              src={project.images[0]}
              alt={project.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <Home size={48} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {project.isNew && (
              <span className="badge bg-secondary text-white text-xs">Новинка</span>
            )}
            {project.isPopular && (
              <span className="badge bg-accent text-white text-xs">Популярный</span>
            )}
          </div>

          {/* Top-right controls: compare + favorite */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            {/* Favorite */}
            <button
              onClick={handleFavorite}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                'bg-white/90 backdrop-blur-sm transition-colors duration-200',
                isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-400',
              )}
              aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
            >
              <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            {/* Compare */}
            <button
              onClick={handleCompare}
              disabled={compareDisabled}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                'bg-white/90 backdrop-blur-sm transition-colors duration-200',
                isInCompare
                  ? 'text-secondary'
                  : compareDisabled
                  ? 'text-gray-200 cursor-not-allowed'
                  : 'text-gray-400 hover:text-secondary',
              )}
              aria-label={isInCompare ? 'Убрать из сравнения' : 'Добавить к сравнению'}
              title={compareDisabled ? 'Можно сравнить не более 4 проектов' : undefined}
            >
              <BarChart2 size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-heading font-semibold text-base text-neutral-dark mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {project.name}
          </h3>

          {/* Specs */}
          <div className="flex items-center gap-4 text-sm text-neutral-medium mb-4">
            <span className="flex items-center gap-1.5">
              <Home size={15} className="text-primary" />
              {formatArea(project.characteristics.area)}
            </span>
            <span className="flex items-center gap-1.5">
              <Bed size={15} className="text-primary" />
              {project.characteristics.bedrooms} спал.
            </span>
            <span>{project.characteristics.floors} эт.</span>
          </div>

          {/* Rating */}
          {project.rating && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={cn(
                      'text-base',
                      star <= Math.round(project.rating!) ? 'text-yellow-400' : 'text-gray-200',
                    )}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-neutral-medium">
                {project.rating.toFixed(1)} ({project.reviewCount} отз.)
              </span>
            </div>
          )}

          <div className="mt-auto">
            {/* Price */}
            <div className="mb-4">
              <p className="text-xs text-neutral-medium mb-0.5">Цена от</p>
              <p className="text-xl font-bold text-primary font-heading">
                {formatPrice(project.price.basePrice)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={(e) => e.preventDefault()}
                className="flex-1 btn-accent text-sm px-3 py-2 min-h-0 h-10"
              >
                Узнать цену
              </button>
              <div className="flex items-center justify-center px-3 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors min-h-0 h-10">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
