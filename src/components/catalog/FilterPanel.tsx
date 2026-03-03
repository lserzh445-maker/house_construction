import React from 'react'
import { RotateCcw } from 'lucide-react'
import type { FilterState } from '@/types'

interface FilterPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onReset: () => void
}

const STYLES = [
  { value: 'finnish', label: 'Финские' },
  { value: 'canadian', label: 'Канадские' },
  { value: 'modern', label: 'Современные' },
  { value: 'barnhouse', label: 'Барнхаус' },
]

const FEATURES = [
  { value: 'garage', label: 'Гараж' },
  { value: 'terrace', label: 'Терраса' },
  { value: 'sauna', label: 'Сауна' },
  { value: 'boiler-room', label: 'Котельная' },
  { value: 'balcony', label: 'Балкон' },
]

const SORT_OPTIONS = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'area-asc', label: 'Площадь: по возрастанию' },
  { value: 'area-desc', label: 'Площадь: по убыванию' },
]

export default function FilterPanel({ filters, onChange, onReset }: FilterPanelProps) {
  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial })

  const toggleArrayValue = (key: 'floors' | 'style' | 'features', value: string | number) => {
    const current = (filters[key] as (string | number)[] | undefined) || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    update({ [key]: updated.length > 0 ? updated : undefined })
  }

  return (
    <aside className="w-full bg-white rounded-xl border border-gray-100 p-5 space-y-6">
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

      {/* Floors */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Этажность</h3>
        <div className="flex gap-2">
          {[1, 2].map((floor) => (
            <button
              key={floor}
              onClick={() => toggleArrayValue('floors', floor)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                filters.floors?.includes(floor)
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 text-neutral-dark hover:border-primary'
              }`}
            >
              {floor} этаж{floor === 1 ? '' : 'а'}
            </button>
          ))}
          <button
            onClick={() => toggleArrayValue('floors', 1.5)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
              filters.floors?.includes(1.5)
                ? 'border-primary bg-primary text-white'
                : 'border-gray-200 text-neutral-dark hover:border-primary'
            }`}
          >
            Мансарда
          </button>
        </div>
      </div>

      {/* Area */}
      <div>
        <h3 className="font-semibold text-sm mb-3">
          Площадь, м² ({filters.areaMin ?? 50}–{filters.areaMax ?? 300}+)
        </h3>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="От"
            value={filters.areaMin ?? ''}
            onChange={(e) => update({ areaMin: e.target.value ? Number(e.target.value) : undefined })}
            className="input-field text-sm py-2 min-h-0 h-10"
            min={0}
          />
          <input
            type="number"
            placeholder="До"
            value={filters.areaMax ?? ''}
            onChange={(e) => update({ areaMax: e.target.value ? Number(e.target.value) : undefined })}
            className="input-field text-sm py-2 min-h-0 h-10"
            min={0}
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Цена, ₽</h3>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="От"
            value={filters.priceMin ?? ''}
            onChange={(e) => update({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
            className="input-field text-sm py-2 min-h-0 h-10"
            min={0}
          />
          <input
            type="number"
            placeholder="До"
            value={filters.priceMax ?? ''}
            onChange={(e) => update({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
            className="input-field text-sm py-2 min-h-0 h-10"
            min={0}
          />
        </div>
      </div>

      {/* Style */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Стиль</h3>
        <div className="flex flex-wrap gap-2">
          {STYLES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggleArrayValue('style', value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                filters.style?.includes(value)
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 text-neutral-dark hover:border-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Дополнительно</h3>
        <div className="space-y-2">
          {FEATURES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.features?.includes(value) ?? false}
                onChange={() => toggleArrayValue('features', value)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-neutral-dark group-hover:text-primary transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Сортировка</h3>
        <select
          value={filters.sortBy ?? 'popular'}
          onChange={(e) => update({ sortBy: e.target.value as FilterState['sortBy'] })}
          className="input-field text-sm py-2 min-h-0 h-10"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  )
}
