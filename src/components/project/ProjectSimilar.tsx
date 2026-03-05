import React from 'react'
import ProductCard from '@/components/catalog/ProductCard'
import type { Project } from '@/types'

interface ProjectSimilarProps {
  projects: Project[]
}

export default function ProjectSimilar({ projects }: ProjectSimilarProps) {
  if (!projects || projects.length === 0) return null

  return (
    <section aria-labelledby="similar-title">
      <h2 id="similar-title" className="section-title mb-6">Похожие проекты</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {projects.map((p) => (
          <ProductCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}
