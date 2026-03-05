/**
 * Client-side PDF generation using jsPDF.
 * Generates a quote estimate (смета) and triggers browser download.
 */

export interface PriceBreakdown {
  materials: number
  labor: number
  overhead: number
  delivery?: number
  foundation?: number
  utilities?: number
  insurance?: number
}

export interface CalculatorData {
  projectId: string
  projectName: string
  projectArea: number
  completionType: 'base' | 'finishing' | 'turnkey'
  selectedOptions: string[]
  priceBreakdown: PriceBreakdown
  totalPrice: number
  monthlyPayment: number
  generatedAt: Date
}

const COMPLETION_LABELS: Record<string, string> = {
  base: 'Без отделки',
  finishing: 'С отделкой',
  turnkey: 'Под ключ',
}

const OPTION_LABELS: Record<string, string> = {
  delivery: 'Доставка на участок',
  foundation: 'Монтаж фундамента',
  utilities: 'Подключение коммуникаций',
  insurance: 'Страховка (3%)',
}

function fmt(n: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export async function generateQuotePDF(data: CalculatorData): Promise<void> {
  // Dynamic import — not loaded until needed
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W = 210
  const margin = 15
  const contentW = W - margin * 2
  let y = 0

  // ── Header background ──────────────────────────────────────────────────────
  doc.setFillColor(27, 94, 32) // #1B5E20
  doc.rect(0, 0, W, 38, 'F')

  // Company name
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('ДомСтрой', margin, 15)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Каркасные дома под ключ с 2007 года', margin, 22)

  // Contacts (right side)
  doc.setFontSize(9)
  doc.text('+7 (499) 123-45-67', W - margin, 13, { align: 'right' })
  doc.text('info@domstroy.ru', W - margin, 19, { align: 'right' })
  doc.text('domstroy.ru', W - margin, 25, { align: 'right' })

  y = 48

  // ── Title ──────────────────────────────────────────────────────────────────
  doc.setTextColor(27, 94, 32)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('СМЕТА НА СТРОИТЕЛЬСТВО', W / 2, y, { align: 'center' })
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(107, 114, 128)
  doc.text(`Дата: ${fmtDate(data.generatedAt)}`, W / 2, y, { align: 'center' })
  y += 10

  // ── Project info box ───────────────────────────────────────────────────────
  doc.setFillColor(240, 253, 244) // #f0fdf4
  doc.setDrawColor(187, 247, 208)
  doc.roundedRect(margin, y, contentW, 40, 3, 3, 'FD')

  doc.setTextColor(22, 101, 52)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('ИНФОРМАЦИЯ О ПРОЕКТЕ', margin + 5, y + 8)

  const labelX = margin + 5
  const valueX = margin + 55
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(75, 85, 99)

  doc.text('Проект:', labelX, y + 17)
  doc.setTextColor(17, 24, 39)
  doc.setFont('helvetica', 'bold')
  doc.text(data.projectName, valueX, y + 17)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(75, 85, 99)
  doc.text('Площадь:', labelX, y + 24)
  doc.setTextColor(17, 24, 39)
  doc.setFont('helvetica', 'bold')
  doc.text(`${data.projectArea} м²`, valueX, y + 24)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(75, 85, 99)
  doc.text('Комплектация:', labelX, y + 31)
  doc.setTextColor(17, 24, 39)
  doc.setFont('helvetica', 'bold')
  doc.text(COMPLETION_LABELS[data.completionType] || data.completionType, valueX, y + 31)

  if (data.selectedOptions.length > 0) {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(75, 85, 99)
    doc.text('Дополнительно:', labelX, y + 38)
    doc.setTextColor(17, 24, 39)
    doc.setFont('helvetica', 'bold')
    const optLabels = data.selectedOptions.map((o) => OPTION_LABELS[o] || o).join(', ')
    doc.text(optLabels, valueX, y + 38, { maxWidth: contentW - 55 })
  }

  y += 48

  // ── Breakdown table ────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(17, 24, 39)
  doc.text('РАЗБОР ПО СТАТЬЯМ', margin, y)
  y += 5

  // Table header
  doc.setFillColor(243, 244, 246)
  doc.rect(margin, y, contentW, 8, 'F')
  doc.setDrawColor(229, 231, 235)
  doc.rect(margin, y, contentW, 8, 'D')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(55, 65, 81)
  doc.text('СТАТЬЯ РАСХОДОВ', margin + 4, y + 5.5)
  doc.text('СУММА', W - margin - 4, y + 5.5, { align: 'right' })
  y += 8

  // Table rows
  const breakdownRows: [string, number][] = [
    ['Материалы', data.priceBreakdown.materials],
    ['Работа строителей', data.priceBreakdown.labor],
    ['Накладные расходы', data.priceBreakdown.overhead],
  ]
  if (data.priceBreakdown.delivery != null)
    breakdownRows.push(['Доставка на участок', data.priceBreakdown.delivery])
  if (data.priceBreakdown.foundation != null)
    breakdownRows.push(['Монтаж фундамента', data.priceBreakdown.foundation])
  if (data.priceBreakdown.utilities != null)
    breakdownRows.push(['Подключение коммуникаций', data.priceBreakdown.utilities])
  if (data.priceBreakdown.insurance != null)
    breakdownRows.push(['Страховка (3%)', data.priceBreakdown.insurance])

  breakdownRows.forEach(([label, value], i) => {
    if (i % 2 === 0) {
      doc.setFillColor(255, 255, 255)
    } else {
      doc.setFillColor(249, 250, 251)
    }
    doc.rect(margin, y, contentW, 8, 'F')
    doc.setDrawColor(229, 231, 235)
    doc.line(margin, y + 8, margin + contentW, y + 8)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(55, 65, 81)
    doc.text(label, margin + 4, y + 5.5)
    doc.text(fmt(value), W - margin - 4, y + 5.5, { align: 'right' })
    y += 8
  })

  // Total row
  doc.setFillColor(27, 94, 32)
  doc.rect(margin, y, contentW, 10, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  doc.text('ИТОГО', margin + 4, y + 7)
  doc.text(fmt(data.totalPrice), W - margin - 4, y + 7, { align: 'right' })
  y += 18

  // ── Financing box ──────────────────────────────────────────────────────────
  doc.setFillColor(239, 246, 255)
  doc.setDrawColor(191, 219, 254)
  doc.roundedRect(margin, y, contentW, 28, 3, 3, 'FD')

  doc.setTextColor(30, 64, 175)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('ВАРИАНТЫ ФИНАНСИРОВАНИЯ', margin + 5, y + 8)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(55, 65, 81)
  doc.text('Примерный ежемесячный платёж:', margin + 5, y + 17)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(30, 64, 175)
  doc.text(`${fmt(data.monthlyPayment)}/мес`, W - margin - 5, y + 17, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128)
  doc.text('Ставка ~8% годовых (Сбер, ВТБ, ДОМ.РФ) • Срок 15–20 лет', margin + 5, y + 24)

  y += 36

  // ── Warning box ────────────────────────────────────────────────────────────
  doc.setFillColor(254, 249, 195)
  doc.setDrawColor(253, 230, 138)
  doc.roundedRect(margin, y, contentW, 16, 3, 3, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(120, 53, 15)
  doc.text(
    'Важно: Настоящая смета является предварительной. Точная стоимость определяется',
    margin + 4,
    y + 7,
  )
  doc.setFont('helvetica', 'normal')
  doc.text('после консультации со специалистом и выезда на участок.', margin + 4, y + 13)

  y += 24

  // ── Footer ─────────────────────────────────────────────────────────────────
  doc.setDrawColor(229, 231, 235)
  doc.line(margin, y, margin + contentW, y)
  y += 6

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(55, 65, 81)
  doc.text('ДомСтрой — ООО «Стройгрупп»', margin, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128)
  doc.text('ИНН: 7701234567  •  ОГРН: 1077701234567', margin, y + 5)

  const expiry = new Date(data.generatedAt.getTime() + 30 * 24 * 3600 * 1000)
  doc.text(`Смета действительна до: ${fmtDate(expiry)}`, margin, y + 10)

  // ── Save ───────────────────────────────────────────────────────────────────
  const safeName = data.projectName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_А-яЁё-]/g, '')
  const dateStr = data.generatedAt.toISOString().split('T')[0]
  doc.save(`smeta_${safeName}_${dateStr}.pdf`)
}
