/**
 * Calculator.tsx — interactive cost estimator for frame houses.
 *
 * Layout:
 *  ┌───────────────────┬──────────────────┐
 *  │  Steps 1-3        │  Summary panel   │
 *  │  (project, type,  │  (breakdown +    │
 *  │   options)        │   payment + CTA) │
 *  └───────────────────┴──────────────────┘
 *
 * On mobile both columns stack vertically.
 */
'use client'

import React, { useState, useMemo } from 'react'
import * as Select   from '@radix-ui/react-select'
import * as Checkbox from '@radix-ui/react-checkbox'
import useSWR from 'swr'
import {
  ChevronDown, Check, Loader2, FileText, Phone,
  AlertCircle, ChevronRight,
} from 'lucide-react'
import { cn }          from '@/utils/cn'
import { formatPrice }  from '@/utils/formatPrice'
import FormModal        from '@/components/modals/FormModal'
import {
  generateQuotePDF,
  type CalculatorData,
  type CompletionType,
} from '@/lib/generate-quote-pdf'
import type { Project } from '@/types'

/* ─── Constants ─────────────────────────────────────────────────────────── */

const MONTHLY_RATE = 0.08 / 12       // 8% annual → monthly
const TERM_MONTHS  = 180             // 15 years

/** Fixed option extras (insurance is % — handled separately) */
const OPTIONS = [
  { id: 'delivery',    label: 'Доставка на участок',          price: 50_000,  pct: null },
  { id: 'foundation',  label: 'Монтаж фундамента',            price: 100_000, pct: null },
  { id: 'utilities',   label: 'Подключение коммуникаций',     price: 80_000,  pct: null },
  { id: 'insurance',   label: 'Страховка (3% от стоимости)',  price: 0,       pct: 0.03 },
] as const

type OptionId = (typeof OPTIONS)[number]['id']

const COMPLETION = [
  {
    key:   'base'      as const,
    label: 'Без отделки',
    desc:  'Каркас, кровля, окна, двери',
    mult:  1,
    badge: 'базовая',
  },
  {
    key:   'finishing' as const,
    label: 'С отделкой',
    desc:  'Чистовая внутренняя отделка',
    mult:  1.25,
    badge: '+25%',
  },
  {
    key:   'turnkey'   as const,
    label: 'Под ключ',
    desc:  'Инженерные системы и мебель',
    mult:  1.45,
    badge: '+45%',
  },
]

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/** Annuity mortgage payment formula */
function monthlyPayment(total: number): number {
  const r = MONTHLY_RATE
  const n = TERM_MONTHS
  if (total <= 0) return 0
  return Math.round((total * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
}


/* ─── Sub-components ─────────────────────────────────────────────────────── */

function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="font-heading font-semibold text-base text-gray-800 mb-3 flex items-center gap-2">
      <span className="w-6 h-6 rounded-full bg-[#1B5E20] text-white text-xs flex items-center justify-center flex-shrink-0">
        {n}
      </span>
      {children}
    </p>
  )
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={cn('flex justify-between text-sm py-1.5', bold && 'font-semibold text-base')}>
      <span className={bold ? 'text-gray-800' : 'text-gray-500'}>{label}</span>
      <span className={bold ? 'text-[#1B5E20]' : 'text-gray-700'}>{formatPrice(value)}</span>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────── */

interface CalculatorProps {
  /** Optional pre-selected project ID (e.g. from a project page). */
  initialProjectId?: string
  className?: string
}

export default function Calculator({ initialProjectId, className }: CalculatorProps) {
  /* ── State ── */
  const [projectId,   setProjectId]   = useState(initialProjectId ?? '')
  const [completion,  setCompletion]  = useState<'base' | 'finishing' | 'turnkey'>('base')
  const [options,     setOptions]     = useState<Set<OptionId>>(new Set())
  const [modalOpen,   setModalOpen]   = useState(false)
  const [pdfLoading,  setPdfLoading]  = useState(false)

  /* ── Data ── */
  const { data: catalogData, isLoading } = useSWR<{ data: Project[] }>(
    '/api/catalog?page_size=50',
    fetcher,
    { revalidateOnFocus: false },
  )
  const projects: Project[] = catalogData?.data ?? []
  const project  = projects.find((p) => p.id === projectId)

  /* ── Calculations (derived — no useEffect needed) ── */
  const calc = useMemo(() => {
    if (!project) return null

    const base      = project.price.basePrice
    const configMult = COMPLETION.find((c) => c.key === completion)!.mult
    const configPrice = Math.round(base * configMult)

    // Fixed options
    const hasDelivery   = options.has('delivery')
    const hasFoundation = options.has('foundation')
    const hasUtilities  = options.has('utilities')
    const hasInsurance  = options.has('insurance')

    const fixedExtras =
      (hasDelivery   ? 50_000  : 0) +
      (hasFoundation ? 100_000 : 0) +
      (hasUtilities  ? 80_000  : 0)

    const subTotal   = configPrice + fixedExtras
    const insurance  = hasInsurance ? Math.round(subTotal * 0.03) : 0
    const total      = subTotal + insurance
    const monthly    = monthlyPayment(total)

    // Price breakdown
    const materials  = Math.round(configPrice * 0.40)
    const labor      = Math.round(configPrice * 0.30)
    const overhead   = configPrice - materials - labor   // remaining 30%

    const breakdown: { label: string; value: number }[] = [
      { label: 'Материалы',           value: materials  },
      { label: 'Работа строителей',   value: labor      },
      { label: 'Накладные расходы',   value: overhead   },
    ]
    if (hasDelivery)   breakdown.push({ label: 'Доставка на участок',      value: 50_000  })
    if (hasFoundation) breakdown.push({ label: 'Монтаж фундамента',        value: 100_000 })
    if (hasUtilities)  breakdown.push({ label: 'Подключение коммуникаций', value: 80_000  })
    if (hasInsurance)  breakdown.push({ label: 'Страховка (3%)',           value: insurance })

    return { configPrice, total, monthly, breakdown, materials, labor, overhead,
             hasDelivery, hasFoundation, hasUtilities, hasInsurance, insurance }
  }, [project, completion, options])

  /* ── Handlers ── */
  const toggleOption = (id: OptionId) =>
    setOptions((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const handleDownload = async () => {
    if (!project || !calc) {
      alert('Пожалуйста, выберите проект')
      return
    }
    if (pdfLoading) return
    setPdfLoading(true)

    // Map calculator completion key → CalculatorData CompletionType
    const completionTypeMap: Record<typeof completion, CompletionType> = {
      base:      'without_finishing',
      finishing: 'with_finishing',
      turnkey:   'turnkey',
    }

    const data: CalculatorData = {
      projectId,
      projectName:     project.name,
      projectArea:     project.characteristics.area,
      completionType:  completionTypeMap[completion],
      selectedOptions: Array.from(options),
      priceBreakdown: {
        materials: calc.materials,
        labor:     calc.labor,
        overhead:  calc.overhead,
        ...(calc.hasDelivery   && { delivery:   50_000              }),
        ...(calc.hasFoundation && { foundation: 100_000             }),
        ...(calc.hasUtilities  && { utilities:  80_000              }),
        ...(calc.hasInsurance  && { insurance:  calc.insurance      }),
      },
      totalPrice:    calc.total,
      monthlyPayment: calc.monthly,
      generatedAt:   new Date(),
    }

    try {
      await generateQuotePDF(data)
    } catch (e) {
      console.error('PDF generation failed:', e)
    } finally {
      setPdfLoading(false)
    }
  }

  /* ─── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

        {/* ══ LEFT COLUMN: Steps 1–3 ══ */}
        <div className="space-y-5">

          {/* ── Step 1: Project ── */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <StepLabel n={1}>Выберите проект</StepLabel>

            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                <Loader2 size={16} className="animate-spin" />
                Загрузка проектов...
              </div>
            ) : (
              <Select.Root value={projectId} onValueChange={(v) => setProjectId(v === '__none__' ? '' : v)}>
                <Select.Trigger
                  className={cn(
                    'input-field flex items-center justify-between text-left w-full',
                    !projectId && 'text-gray-400',
                  )}
                  aria-label="Выберите проект"
                >
                  <Select.Value placeholder="Выберите проект">
                    {project
                      ? `${project.name} (${project.characteristics.area} м²)`
                      : 'Выберите проект'}
                  </Select.Value>
                  <Select.Icon className="flex-shrink-0 ml-2">
                    <ChevronDown size={16} className="text-gray-400" />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content
                    className="z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95"
                    position="popper"
                    sideOffset={4}
                  >
                    <Select.Viewport className="max-h-72 overflow-y-auto p-1.5">
                      <Select.Item
                        value="__none__"
                        className="relative flex items-center px-3 py-2.5 text-sm text-gray-400 rounded-lg cursor-pointer hover:bg-gray-50 outline-none data-[highlighted]:bg-gray-50"
                      >
                        <Select.ItemText>Выберите проект</Select.ItemText>
                      </Select.Item>
                      {projects.map((p) => (
                        <Select.Item
                          key={p.id}
                          value={p.id}
                          className="relative flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-green-50 outline-none data-[highlighted]:bg-green-50 data-[state=checked]:text-[#1B5E20] data-[state=checked]:font-medium gap-3"
                        >
                          <Select.ItemText>
                            {p.name} ({p.characteristics.area} м²)
                          </Select.ItemText>
                          <Select.ItemIndicator>
                            <Check size={14} className="text-[#1B5E20] flex-shrink-0" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            )}

            {/* Selected project quick-stats */}
            {project && (
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
                <span>{project.characteristics.floors} эт.</span>
                <span>{project.characteristics.bedrooms} спал.</span>
                <span>{project.characteristics.size} м</span>
                <span>{project.characteristics.buildingTime}</span>
                <span className="text-[#1B5E20] font-medium">
                  от {formatPrice(project.price.basePrice)}
                </span>
              </div>
            )}
          </section>

          {/* ── Step 2: Completion type ── */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <StepLabel n={2}>Выберите комплектацию</StepLabel>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {COMPLETION.map(({ key, label, desc, badge }) => {
                const active = completion === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCompletion(key)}
                    aria-pressed={active}
                    className={cn(
                      'flex flex-col items-start text-left px-4 py-3.5 rounded-xl border-2 transition-all',
                      active
                        ? 'border-[#1B5E20] bg-[#1B5E20]/5'
                        : 'border-gray-200 hover:border-green-300',
                    )}
                  >
                    <span
                      className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5',
                        active
                          ? 'bg-[#1B5E20] text-white'
                          : 'bg-gray-100 text-gray-500',
                      )}
                    >
                      {badge}
                    </span>
                    <span className={cn('font-semibold text-sm', active ? 'text-[#1B5E20]' : 'text-gray-800')}>
                      {label}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5 leading-snug">{desc}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* ── Step 3: Options ── */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <StepLabel n={3}>Дополнительные опции</StepLabel>
            <div className="space-y-2.5">
              {OPTIONS.map(({ id, label, price, pct }) => {
                const checked = options.has(id)
                return (
                  <label
                    key={id}
                    className={cn(
                      'flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all',
                      checked
                        ? 'border-[#1B5E20] bg-[#1B5E20]/5'
                        : 'border-gray-100 hover:border-green-200 bg-gray-50',
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Checkbox.Root
                        checked={checked}
                        onCheckedChange={() => toggleOption(id)}
                        className={cn(
                          'w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center outline-none transition-colors',
                          'focus-visible:ring-2 focus-visible:ring-[#1B5E20] focus-visible:ring-offset-1',
                          checked
                            ? 'border-[#1B5E20] bg-[#1B5E20]'
                            : 'border-gray-300 bg-white',
                        )}
                      >
                        <Checkbox.Indicator>
                          <Check size={12} className="text-white" />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </span>
                    <span className="text-sm font-semibold text-[#1B5E20] flex-shrink-0 ml-2">
                      {pct ? `+${(pct * 100).toFixed(0)}%` : `+${formatPrice(price)}`}
                    </span>
                  </label>
                )
              })}
            </div>
          </section>
        </div>

        {/* ══ RIGHT COLUMN: Summary ══ */}
        <div className="sticky top-20">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="bg-[#1B5E20] px-5 py-4">
              <p className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-0.5">
                Результат расчёта
              </p>
              <p className="text-white font-heading font-bold text-2xl">
                {calc ? formatPrice(calc.total) : '—'}
              </p>
              {calc && (
                <p className="text-green-300 text-xs mt-1">
                  Примерная стоимость · обновляется в реальном времени
                </p>
              )}
            </div>

            <div className="p-5 space-y-5">

              {/* No project placeholder */}
              {!project && (
                <div className="flex flex-col items-center py-6 text-center text-gray-400 gap-2">
                  <AlertCircle size={28} className="text-gray-300" />
                  <p className="text-sm">Выберите проект для расчёта стоимости</p>
                </div>
              )}

              {/* Breakdown */}
              {calc && (
                <>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Разбор по статьям
                    </p>
                    <div className="divide-y divide-gray-50">
                      {calc.breakdown.map(({ label, value }) => (
                        <Row key={label} label={label} value={value} />
                      ))}
                    </div>
                    <div className="border-t-2 border-[#1B5E20]/20 mt-2 pt-2">
                      <Row label="ИТОГО" value={calc.total} bold />
                    </div>
                  </div>

                  {/* Monthly payment */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs font-semibold text-[#0288D1] uppercase tracking-wider mb-1.5">
                      Финансирование доступно
                    </p>
                    <p className="text-2xl font-heading font-bold text-gray-800">
                      {formatPrice(calc.monthly)}<span className="text-base font-normal text-gray-400">/мес</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      При ипотеке 8% годовых на 15 лет
                    </p>
                  </div>

                  {/* Disclaimer */}
                  <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 leading-relaxed">
                    Расчёт предварительный. Точная стоимость определяется после выезда
                    специалиста на ваш участок.
                  </p>

                  {/* Action buttons */}
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (!project) { alert('Пожалуйста, выберите проект'); return }
                        setModalOpen(true)
                      }}
                      className="w-full bg-[#FF9100] hover:bg-orange-500 text-white font-semibold px-5 py-3 rounded-xl transition-colors min-h-[48px] flex items-center justify-center gap-2 text-sm"
                    >
                      <Phone size={17} />
                      Узнать точную цену
                      <ChevronRight size={15} className="ml-auto opacity-70" />
                    </button>

                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={pdfLoading}
                      className="w-full bg-white border-2 border-gray-200 hover:border-[#1B5E20] text-gray-700 hover:text-[#1B5E20] disabled:opacity-60 disabled:cursor-wait font-medium px-5 py-3 rounded-xl transition-colors min-h-[48px] flex items-center justify-center gap-2 text-sm"
                    >
                      {pdfLoading
                        ? <><Loader2 size={17} className="animate-spin" />Генерация PDF...</>
                        : <><FileText size={17} />Скачать PDF смету</>
                      }
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* FormModal (QuoteForm) */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formType="quote"
        projectId={project ? projectId : undefined}
      />
    </div>
  )
}
