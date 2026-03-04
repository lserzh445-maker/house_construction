import React, { useState, useEffect } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { CatalogParams } from '@/hooks/useCatalog'

/* ─── Constants ──────────────────────────────────────────────────────────── */

const AREA_MIN  = 40
const AREA_MAX  = 250
const PRICE_MIN = 3_000_000
const PRICE_MAX = 25_000_000
const PRICE_STEP = 500_000

const FLOORS_OPTIONS = [
  { value: '1',       label: '1 этаж' },
  { value: '2',       label: '2 этажа' },
  { value: 'mansard', label: 'Мансарда' },
]

const STYLES = [
  { value: 'finnish',  label: 'Финские' },
  { value: 'canadian', label: 'Канадские' },
  { value: 'modern',   label: 'Современные' },
  { value: 'barnhouse',label: 'Барнхаус' },
]

const FEATURES = [
  { value: 'terrace',     label: 'Терраса' },
  { value: 'sauna',       label: 'Сауна' },
  { value: 'garage',      label: 'Гараж' },
  { value: 'balcony',     label: 'Балкон' },
  { value: 'boiler-room', label: 'Котельная' },
]

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function fmtArea(v: number) { return `${v} м²` }
function fmtPrice(v: number) { return `${(v / 1_000_000).toFixed(1)}М ₽` }

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface FilterPanelProps {
  params:   CatalogParams
  onChange: (partial: Partial<CatalogParams>) => void
  onReset:  () => void
}

/* ─── Slider wrapper ─────────────────────────────────────────────────────── */

function RangeSlider({
  label, min, max, step, value, format, onCommit,
}: {
  label:    string
  min:      number
  max:      number
  step:     number
  value:    [number, number]
  format:   (v: number) => string
  onCommit: (v: [number, number]) => void
}) {
  const [local, setLocal] = useState<[number, number]>(value)

  // sync when parent resets
  useEffect(() => { setLocal(value) }, [value])

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">{label}</h3>
        <span className="text-xs text-neutral-medium">
          {format(local[0])} — {format(local[1])}
        </span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        min={min}
        max={max}
        step={step}
        value={local}
        onValueChange={(v) => setLocal(v as [number, number])}
        onValueCommit={(v) => onCommit(v as [number, number])}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-primary rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-2 border-primary rounded-full shadow
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Минимум ${label}`}
        />
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-2 border-primary rounded-full shadow
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Максимум ${label}`}
        />
      </Slider.Root>
    </div>
  )
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function FilterPanel({ params, onChange, onReset }: FilterPanelProps) {
  const areaValue:  [number, number] = [params.area_from  ?? AREA_MIN,  params.area_to  ?? AREA_MAX]
  const priceValue: [number, number] = [params.price_from ?? PRICE_MIN, params.price_to ?? PRICE_MAX]

  const toggleStyle = (value: string) => {
    const current = params.style ?? []
    onChange({
      style: current.includes(value) ? current.filter((s) => s !== value) : [...current, value],
      page:  undefined,
    })
  }

  const toggleFeature = (value: string) => {
    const current = params.features ?? []
    onChange({
      features: current.includes(value) ? current.filter((f) => f !== value) : [...current, value],
      page:     undefined,
    })
  }

  return (
    <aside className="w-full bg-white rounded-xl border border-gray-100 p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-lg">Фильтры</h2>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm text-neutral-medium hover:text-primary transition-colors"
        >
          <RotateCcw size={14} />
          Сбросить
        </button>
      </div>

      {/* ── Floors ────────────────────────────────────────────────────────── */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Этажность</h3>
        <div className="flex flex-wrap gap-2">
          {/* "Any" option */}
          <button
            onClick={() => onChange({ floors: undefined, page: undefined })}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-colors',
              params.floors === undefined
                ? 'border-primary bg-primary text-white'
                : 'border-gray-200 text-neutral-dark hover:border-primary',
            )}
          >
            Любая
          </button>
          {FLOORS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ floors: value, page: undefined })}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-colors',
                params.floors === value
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 text-neutral-dark hover:border-primary',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Area slider ───────────────────────────────────────────────────── */}
      <RangeSlider
        label="Площадь, м²"
        min={AREA_MIN}
        max={AREA_MAX}
        step={5}
        value={areaValue}
        format={fmtArea}
        onCommit={([from, to]) => onChange({
          area_from: from > AREA_MIN ? from : undefined,
          area_to:   to   < AREA_MAX ? to   : undefined,
          page:      undefined,
        })}
      />

      {/* ── Price slider ──────────────────────────────────────────────────── */}
      <RangeSlider
        label="Цена"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={PRICE_STEP}
        value={priceValue}
        format={fmtPrice}
        onCommit={([from, to]) => onChange({
          price_from: from > PRICE_MIN ? from : undefined,
          price_to:   to   < PRICE_MAX ? to   : undefined,
          page:       undefined,
        })}
      />

      {/* ── Style ─────────────────────────────────────────────────────────── */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Стиль</h3>
        <div className="space-y-2">
          {STYLES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={params.style?.includes(value) ?? false}
                onChange={() => toggleStyle(value)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-neutral-dark group-hover:text-primary transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Дополнительно</h3>
        <div className="space-y-2">
          {FEATURES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={params.features?.includes(value) ?? false}
                onChange={() => toggleFeature(value)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-neutral-dark group-hover:text-primary transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}
