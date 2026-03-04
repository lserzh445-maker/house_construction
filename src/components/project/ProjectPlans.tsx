import React, { useState } from 'react'
import Image from 'next/image'
import { LayoutGrid, X, Download, Maximize2 } from 'lucide-react'

interface ProjectPlansProps {
  floorPlans: string[]
  projectName: string
  floors: number
}

export default function ProjectPlans({ floorPlans, projectName, floors }: ProjectPlansProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  if (!floorPlans || floorPlans.length === 0) return null

  // Filter out PDF-only plans for image preview (show PDF link instead)
  const imagePlans = floorPlans.filter((p) => !p.endsWith('.pdf'))
  const pdfPlans   = floorPlans.filter((p) => p.endsWith('.pdf'))

  return (
    <section aria-labelledby="plans-title">
      <div className="flex items-center gap-2 mb-4">
        <LayoutGrid size={18} className="text-[#1B5E20]" />
        <h2 id="plans-title" className="font-heading font-bold text-xl text-gray-800">Планы этажей</h2>
      </div>

      {imagePlans.length > 0 && (
        <div className={`grid gap-4 mb-4 ${imagePlans.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-md'}`}>
          {imagePlans.map((src, idx) => (
            <div key={idx} className="relative group">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <Image
                  src={src}
                  alt={`${projectName} — план ${idx + 1} этажа`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setLightboxSrc(src)}
                  className="w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                  aria-label="Увеличить план"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
              <p className="mt-2 text-sm text-center text-gray-500 font-medium">
                {floors > 1 ? `${idx + 1} этаж` : 'План этажа'}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Fallback: only PDFs */}
      {imagePlans.length === 0 && pdfPlans.length > 0 && (
        <p className="text-sm text-gray-500 mb-4">Планы доступны для скачивания ниже.</p>
      )}

      {/* PDF download links */}
      {pdfPlans.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pdfPlans.map((pdf, idx) => (
            <a
              key={idx}
              href={pdf}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              <Download size={14} />
              Скачать план {floors > 1 ? `(${idx + 1} этаж)` : ''} PDF
            </a>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxSrc(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Закрыть"
          >
            <X size={20} />
          </button>
          <div
            className="relative w-full max-w-3xl"
            style={{ aspectRatio: '4/3' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxSrc}
              alt="План этажа"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </section>
  )
}
