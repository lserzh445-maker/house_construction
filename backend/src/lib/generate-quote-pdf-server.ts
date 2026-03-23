/**
 * generate-quote-pdf-server.ts
 *
 * Server-side PDF generation using html2pdf.co API.
 * Correctly handles Cyrillic / Russian text (UTF-8 HTML rendered in the cloud).
 *
 * Free tier: 100 requests/month  →  https://api.html2pdf.app/v1/generate
 * Types are defined locally — no @/ alias (Express backend, not Next.js).
 */

import axios from 'axios'

// ─── Types (mirrors src/lib/generate-quote-pdf.ts on the frontend) ───────────

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
  generatedAt: Date | string
}

// ─── Labels ───────────────────────────────────────────────────────────────────

const COMPLETION_LABELS: Record<string, string> = {
  base:      'Без отделки',
  finishing: 'С отделкой',
  turnkey:   'Под ключ',
}

const OPTION_LABELS: Record<string, string> = {
  delivery:   'Доставка на участок',
  foundation: 'Монтаж фундамента',
  utilities:  'Подключение коммуникаций',
  insurance:  'Страховка (3%)',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function buildBreakdownRows(bd: PriceBreakdown): string {
  const rows: [string, number][] = [
    ['Материалы', bd.materials],
    ['Работа строителей', bd.labor],
    ['Накладные расходы', bd.overhead],
  ]
  if (bd.delivery   != null) rows.push(['Доставка на участок',     bd.delivery])
  if (bd.foundation != null) rows.push(['Монтаж фундамента',        bd.foundation])
  if (bd.utilities  != null) rows.push(['Подключение коммуникаций', bd.utilities])
  if (bd.insurance  != null) rows.push(['Страховка (3%)',           bd.insurance])

  return rows
    .map(([label, value], idx) => `
      <tr style="background:${idx % 2 === 0 ? '#fff' : '#f9fafb'}">
        <td style="padding:9px 14px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#374151">${label}</td>
        <td style="padding:9px 14px;border-bottom:1px solid #e5e7eb;text-align:right;font-size:13px;color:#374151;white-space:nowrap">${fmt(value)}</td>
      </tr>`)
    .join('')
}

function buildSmetaHtml(data: CalculatorData): string {
  const generatedAt    = data.generatedAt instanceof Date ? data.generatedAt : new Date(data.generatedAt)
  const date           = fmtDate(generatedAt)
  const expiry         = fmtDate(new Date(generatedAt.getTime() + 30 * 24 * 3600 * 1000))
  const completionLabel = COMPLETION_LABELS[data.completionType] ?? data.completionType

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Смета ДомСтрой</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #111; line-height: 1.6; }
    .container { width: 210mm; padding: 0; margin: 0; background: white; }

    .header { background: #1B5E20; color: #fff; padding: 20px 28px; display: flex; justify-content: space-between; align-items: flex-start; }
    .header-left h1 { font-size: 24px; font-weight: 700; letter-spacing: 1px; margin: 0; }
    .header-left p { font-size: 11px; opacity: 0.75; margin-top: 3px; }
    .header-right { text-align: right; font-size: 11px; opacity: 0.9; line-height: 1.7; }

    .title { text-align: center; padding: 22px 28px 16px; }
    .title h2 { font-size: 19px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #1B5E20; margin: 0; }
    .title p { font-size: 12px; color: #6b7280; margin-top: 5px; }

    .section { padding: 0 28px 18px; }

    .info-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px 20px; }
    .info-box h3 { font-size: 13px; font-weight: 700; color: #166534; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-box table { width: 100%; border-collapse: collapse; }
    .info-box td { padding: 4px 0; font-size: 13px; }
    .info-box td:first-child { color: #4b5563; width: 45%; }
    .info-box td:last-child { font-weight: 600; }

    .breakdown-title { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    table.breakdown-table { width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; }
    table.breakdown-table thead tr { background: #f3f4f6; }
    table.breakdown-table th { padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; }
    table.breakdown-table th:last-child { text-align: right; }
    table.breakdown-table td { padding: 9px 14px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
    table.breakdown-table tbody tr:last-child { background: #1B5E20; color: #fff; }
    table.breakdown-table tbody tr:last-child td { padding: 12px 14px; border-bottom: none; font-weight: 700; font-size: 14px; }
    table.breakdown-table tbody tr:last-child td:last-child { text-align: right; font-size: 16px; }

    .financing-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 16px 20px; }
    .financing-box h3 { font-size: 13px; font-weight: 700; color: #1e40af; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .monthly-payment { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .monthly-label { font-size: 13px; color: #374151; }
    .monthly-amount { font-size: 18px; font-weight: 700; color: #1e40af; }
    .financing-box table { width: 100%; border-collapse: collapse; }
    .financing-box td { padding: 3px 0; font-size: 12px; color: #6b7280; }
    .financing-box td:last-child { text-align: right; }

    .disclaimer { margin: 0 28px 18px; padding: 12px 16px; background: #fef9c3; border: 1px solid #fde68a; border-radius: 8px; }
    .disclaimer p { font-size: 12px; color: #78350f; line-height: 1.6; margin: 0; }

    .footer { margin: 0 28px; padding: 16px 0; border-top: 2px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; }
    .footer-left { line-height: 1.6; }
    .footer-left strong { color: #374151; display: block; margin-bottom: 4px; }
    .footer-right { text-align: right; line-height: 1.6; }

    @media print { body { margin: 0; } .container { width: auto; } }
  </style>
</head>
<body>
<div class="container">

  <div class="header">
    <div class="header-left">
      <h1>ДомСтрой</h1>
      <p>Каркасные дома под ключ с 2007 года</p>
    </div>
    <div class="header-right">
      <div>+7 (499) 123-45-67</div>
      <div>info@domstroy.ru</div>
      <div>domstroy.ru</div>
    </div>
  </div>

  <div class="title">
    <h2>СМЕТА НА СТРОИТЕЛЬСТВО</h2>
    <p>Дата: ${date}</p>
  </div>

  <div class="section">
    <div class="info-box">
      <h3>Информация о проекте</h3>
      <table>
        <tr><td>Проект:</td><td>${data.projectName}</td></tr>
        <tr><td>Площадь:</td><td>${data.projectArea} м²</td></tr>
        <tr><td>Комплектация:</td><td>${completionLabel}</td></tr>
        ${data.selectedOptions.length > 0 ? `
        <tr>
          <td>Дополнительно:</td>
          <td>${data.selectedOptions.map((o) => OPTION_LABELS[o] ?? o).join(', ')}</td>
        </tr>` : ''}
      </table>
    </div>
  </div>

  <div class="section">
    <div class="breakdown-title">Разбор по статьям</div>
    <table class="breakdown-table">
      <thead>
        <tr>
          <th>Статья расходов</th>
          <th style="text-align:right">Сумма, ₽</th>
        </tr>
      </thead>
      <tbody>
        ${buildBreakdownRows(data.priceBreakdown)}
        <tr>
          <td>ИТОГО</td>
          <td style="text-align:right">${fmt(data.totalPrice)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="financing-box">
      <h3>Варианты финансирования</h3>
      <div class="monthly-payment">
        <span class="monthly-label">Примерный ежемесячный платёж:</span>
        <span class="monthly-amount">${fmt(data.monthlyPayment)}/мес</span>
      </div>
      <table>
        <tr>
          <td>Процентная ставка:</td>
          <td>~8% годовых (Сбер, ВТБ, ДОМ.РФ)</td>
        </tr>
        <tr>
          <td>Срок кредитования:</td>
          <td>15–20 лет (в зависимости от банка)</td>
        </tr>
      </table>
    </div>
  </div>

  <div class="disclaimer">
    <p><strong>⚠ Важно:</strong> Настоящая смета является предварительной и составлена на основе стандартных нормативов. Точная стоимость определяется после выезда специалиста на участок и может отличаться в зависимости от типа фундамента, рельефа участка и индивидуальных пожеланий.</p>
  </div>

  <div class="footer">
    <div class="footer-left">
      <strong>ДомСтрой — ООО «Стройгрупп»</strong>
      <div>ИНН: 7701234567 · ОГРН: 1077701234567</div>
      <div>Тел: +7 (499) 123-45-67 · info@domstroy.ru</div>
      <div>г. Москва, ул. Строителей, д. 1, офис 101</div>
    </div>
    <div class="footer-right">
      <div>Смета действительна до: <strong>${expiry}</strong></div>
      <div style="margin-top:2px">Дата генерации: ${date}</div>
    </div>
  </div>

</div>
</body>
</html>`
}

// ─── Main export ──────────────────────────────────────────────────────────────

const HTML2PDF_API = 'https://api.html2pdf.app/v1/generate'

export async function generateQuotePDFServer(data: CalculatorData): Promise<Buffer> {
  console.log('[PDF] Generating PDF for project:', data.projectName)

  const html = buildSmetaHtml(data)

  const response = await axios.post(
    HTML2PDF_API,
    {
      html,
      options: {
        margin: 0,
        filename: `smeta_${data.projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      },
    },
    { timeout: 30_000, responseType: 'arraybuffer' },
  )

  const pdfBuffer = Buffer.from(response.data as ArrayBuffer)
  console.log('[PDF] ✅ PDF generated, size:', pdfBuffer.length, 'bytes')
  return pdfBuffer
}
