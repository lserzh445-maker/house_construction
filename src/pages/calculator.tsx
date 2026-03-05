import React, { useState } from 'react'
import { Calculator, Download, Phone, Loader2 } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import CallForm from '@/components/forms/CallForm'
import { formatPrice } from '@/utils/formatPrice'
import type { CalculatorData } from '@/lib/generate-quote-pdf'

const PROJECTS_LIST = [
  { id: 'fin-d5', name: 'Финский дом Д-5', area: 85, basePrice: 8160000 },
  { id: 'modern-m1', name: 'Современный М-1', area: 65, basePrice: 5400000 },
  { id: 'barn-b3', name: 'Барнхаус Б-3', area: 120, basePrice: 9800000 },
  { id: 'custom', name: 'Свой проект', area: 0, basePrice: 0 },
]

const OPTIONS = [
  { id: 'delivery', label: 'Доставка на участок', price: 50000 },
  { id: 'foundation', label: 'Монтаж фундамента', price: 100000 },
  { id: 'utilities', label: 'Подключение коммуникаций', price: 80000 },
  { id: 'insurance', label: 'Страховка (3%)', price: 0 },
]

const CONFIGURATION_MULTIPLIERS = {
  base: 1,
  finishing: 1.2,
  turnkey: 1.4,
}

export default function CalculatorPage() {
  const [selectedProject, setSelectedProject] = useState(PROJECTS_LIST[0].id)
  const [customArea, setCustomArea] = useState(100)
  const [configuration, setConfiguration] = useState<'base' | 'finishing' | 'turnkey'>('base')
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set())
  const [showForm, setShowForm] = useState(false)

  const project = PROJECTS_LIST.find((p) => p.id === selectedProject)!
  const isCustom = selectedProject === 'custom'

  const area = isCustom ? customArea : project.area
  const pricePerSqm = isCustom ? 62000 : Math.round(project.basePrice / project.area)
  const baseTotal = pricePerSqm * area * CONFIGURATION_MULTIPLIERS[configuration]

  const optionsTotal = Array.from(selectedOptions).reduce((sum, optId) => {
    const opt = OPTIONS.find((o) => o.id === optId)!
    if (opt.id === 'insurance') return sum + baseTotal * 0.03
    return sum + opt.price
  }, 0)

  const total = baseTotal + optionsTotal
  const monthlyPayment = Math.round(total / 240) // ~20 years

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const { generateQuotePDF } = await import('@/lib/generate-quote-pdf')

      const materialsShare = 0.45
      const laborShare = 0.35
      const overheadShare = 0.20
      const materials = Math.round(baseTotal * materialsShare)
      const labor = Math.round(baseTotal * laborShare)
      const overhead = Math.round(baseTotal * overheadShare)

      const breakdown: CalculatorData['priceBreakdown'] = { materials, labor, overhead }
      if (selectedOptions.has('delivery')) breakdown.delivery = 50000
      if (selectedOptions.has('foundation')) breakdown.foundation = 100000
      if (selectedOptions.has('utilities')) breakdown.utilities = 80000
      if (selectedOptions.has('insurance')) breakdown.insurance = Math.round(baseTotal * 0.03)

      const quoteData: CalculatorData = {
        projectId: selectedProject,
        projectName: isCustom ? `Свой проект (${customArea} м²)` : project.name,
        projectArea: area,
        completionType: configuration,
        selectedOptions: Array.from(selectedOptions),
        priceBreakdown: breakdown,
        totalPrice: total,
        monthlyPayment,
        generatedAt: new Date(),
      }

      await generateQuotePDF(quoteData)
    } catch (err) {
      console.error('PDF generation error:', err)
      alert('Не удалось сгенерировать PDF. Попробуйте ещё раз.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <Layout
      title="Онлайн-калькулятор стоимости каркасного дома"
      description="Рассчитайте стоимость каркасного дома онлайн: выберите проект, комплектацию, дополнительные опции. Мгновенный результат."
      canonical="/calculator"
    >
      {/* Header */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Calculator size={40} className="mx-auto mb-4 text-accent" />
          <h1 className="font-heading font-bold text-4xl mb-3">Калькулятор стоимости</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Рассчитайте предварительную стоимость вашего будущего дома за несколько кликов
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Project */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-heading font-semibold text-lg mb-4">
                <span className="w-7 h-7 bg-primary text-white rounded-full inline-flex items-center justify-center text-sm mr-2">1</span>
                Выбор проекта
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECTS_LIST.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p.id)}
                    className={`px-4 py-3 rounded-xl text-left border-2 transition-colors ${
                      selectedProject === p.id
                        ? 'border-primary bg-primary-50'
                        : 'border-gray-200 hover:border-primary-200'
                    }`}
                  >
                    <p className="font-medium text-sm">{p.name}</p>
                    {p.area > 0 && (
                      <p className="text-xs text-neutral-medium mt-0.5">{p.area} м²</p>
                    )}
                  </button>
                ))}
              </div>
              {isCustom && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-neutral-dark mb-2 block">
                    Площадь дома (м²)
                  </label>
                  <input
                    type="number"
                    value={customArea}
                    onChange={(e) => setCustomArea(Number(e.target.value))}
                    min={30}
                    max={500}
                    className="input-field max-w-xs"
                  />
                </div>
              )}
            </div>

            {/* Step 2: Configuration */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-heading font-semibold text-lg mb-4">
                <span className="w-7 h-7 bg-primary text-white rounded-full inline-flex items-center justify-center text-sm mr-2">2</span>
                Комплектация
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([
                  { key: 'base', label: 'Без отделки', desc: 'Каркас, кровля, окна, двери' },
                  { key: 'finishing', label: 'С отделкой', desc: '+20% к базовой цене' },
                  { key: 'turnkey', label: 'Под ключ', desc: '+40% к базовой цене' },
                ] as const).map(({ key, label, desc }) => (
                  <button
                    key={key}
                    onClick={() => setConfiguration(key)}
                    className={`p-4 rounded-xl text-left border-2 transition-colors ${
                      configuration === key
                        ? 'border-primary bg-primary-50'
                        : 'border-gray-200 hover:border-primary-200'
                    }`}
                  >
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-neutral-medium mt-1">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Options */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-heading font-semibold text-lg mb-4">
                <span className="w-7 h-7 bg-primary text-white rounded-full inline-flex items-center justify-center text-sm mr-2">3</span>
                Дополнительные опции
              </h2>
              <div className="space-y-3">
                {OPTIONS.map((opt) => (
                  <label key={opt.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-primary-100 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedOptions.has(opt.id)}
                        onChange={() => toggleOption(opt.id)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </div>
                    <span className="text-sm text-primary font-semibold">
                      {opt.id === 'insurance' ? '+3%' : `+${formatPrice(opt.price)}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-heading font-semibold text-lg mb-5">Результат расчёта</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-medium">Площадь</span>
                    <span className="font-medium">{area} м²</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-medium">Комплектация</span>
                    <span className="font-medium">
                      {configuration === 'base' ? 'Без отделки' : configuration === 'finishing' ? 'С отделкой' : 'Под ключ'}
                    </span>
                  </div>
                  {Array.from(selectedOptions).map((optId) => {
                    const opt = OPTIONS.find((o) => o.id === optId)!
                    return (
                      <div key={optId} className="flex justify-between text-sm">
                        <span className="text-neutral-medium">{opt.label}</span>
                        <span className="font-medium text-primary">
                          {opt.id === 'insurance' ? formatPrice(baseTotal * 0.03) : `+${formatPrice(opt.price)}`}
                        </span>
                      </div>
                    )
                  })}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Итого</span>
                      <span className="font-bold text-primary text-xl font-heading">
                        {formatPrice(total)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-medium mt-1">
                      ~{formatPrice(monthlyPayment)}/мес при ипотеке на 20 лет
                    </p>
                  </div>
                </div>

                <p className="text-xs text-neutral-medium mb-4 p-3 bg-neutral-light rounded-lg">
                  Расчёт приблизительный. Точная стоимость определяется после выезда специалиста на участок.
                </p>

                {!showForm ? (
                  <div className="space-y-3">
                    <button onClick={() => setShowForm(true)} className="btn-primary w-full">
                      <Phone size={18} />
                      Узнать точную цену
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPDF}
                      className="btn-outline w-full text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isGeneratingPDF ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Генерирую...
                        </>
                      ) : (
                        <>
                          <Download size={16} />
                          Скачать смету (PDF)
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div>
                    <CallForm onSuccess={() => setShowForm(false)} />
                    <button onClick={() => setShowForm(false)} className="mt-2 text-xs text-neutral-medium hover:text-neutral-dark w-full">
                      Отмена
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
