/**
 * generate-quote-pdf-server.ts
 *
 * Server-side PDF generation using Puppeteer (headless Chrome).
 * html2canvas / jsPDF are browser-only — Puppeteer is the correct Node.js approach.
 *
 * Returns a PDF Buffer ready to be streamed as an HTTP response or attached to an email.
 */

import puppeteer from 'puppeteer'

/* ─── Types (mirrors src/lib/generate-quote-pdf.ts on the frontend) ────────── */

export type CompletionType = 'without_finishing' | 'with_finishing' | 'turnkey'
export type OptionId = 'delivery' | 'foundation' | 'utilities' | 'insurance'

export interface PriceBreakdown {
  materials:   number
  labor:       number
  overhead:    number
  delivery?:   number
  foundation?: number
  utilities?:  number
  insurance?:  number
}

export interface QuoteData {
  projectId:       string
  projectName:     string
  projectArea:     number
  completionType:  CompletionType
  selectedOptions: OptionId[]
  priceBreakdown:  PriceBreakdown
  totalPrice:      number
  monthlyPayment:  number
  generatedAt:     Date
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function fmt(n: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency', currency: 'RUB',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n)
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function slugify(s: string): string {
  const TRANSLIT: Record<string, string> = {
    а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'yo', ж:'zh',
    з:'z', и:'i', й:'y', к:'k', л:'l', м:'m', н:'n', о:'o',
    п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f', х:'kh', ц:'ts',
    ч:'ch', ш:'sh', щ:'shch', ъ:'', ы:'y', ь:'', э:'e', ю:'yu', я:'ya',
  }
  return s
    .replace(/[а-яё]/gi, (c) => TRANSLIT[c.toLowerCase()] ?? c)
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase()
    .slice(0, 30)
}

const COMPLETION_LABELS: Record<CompletionType, string> = {
  without_finishing: 'Без отделки',
  with_finishing:    'С отделкой',
  turnkey:           'Полностью под ключ',
}

const OPTION_LABELS: Record<OptionId, string> = {
  delivery:   'Доставка на участок',
  foundation: 'Монтаж фундамента',
  utilities:  'Подключение коммуникаций',
  insurance:  'Страховка (3%)',
}

/* ─── HTML template ──────────────────────────────────────────────────────────── */

function buildBreakdownRows(bd: PriceBreakdown): string {
  const rows: [string, number][] = [
    ['Материалы',           bd.materials],
    ['Работа строителей',   bd.labor],
    ['Накладные расходы',   bd.overhead],
  ]
  if (bd.delivery   != null) rows.push(['Доставка на участок',      bd.delivery])
  if (bd.foundation != null) rows.push(['Монтаж фундамента',         bd.foundation])
  if (bd.utilities  != null) rows.push(['Подключение коммуникаций',  bd.utilities])
  if (bd.insurance  != null) rows.push(['Страховка (3%)',            bd.insurance])

  return rows.map(([label, value], idx) => `
    <tr style="background:${idx % 2 === 0 ? '#fff' : '#f9fafb'}">
      <td style="padding:9px 14px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#374151">${label}</td>
      <td style="padding:9px 14px;border-bottom:1px solid #e5e7eb;text-align:right;font-size:13px;color:#374151">${fmt(value)}</td>
    </tr>`).join('')
}

function buildHtml(data: QuoteData): string {
  const date    = fmtDate(data.generatedAt)
  const expiry  = fmtDate(new Date(data.generatedAt.getTime() + 30 * 24 * 3600 * 1000))
  const optionsRow = data.selectedOptions.length > 0
    ? `<tr><td style="padding:4px 0;color:#4b5563;font-size:13px;vertical-align:top">Дополнительно:</td>
       <td style="padding:4px 0;font-weight:600;font-size:13px">${data.selectedOptions.map((o) => OPTION_LABELS[o]).join(', ')}</td></tr>`
    : ''

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #111; }
</style>
</head>
<body>
<div style="width:794px;padding:0">

  <!-- HEADER -->
  <div style="background:#1B5E20;color:#fff;padding:20px 28px;display:flex;justify-content:space-between;align-items:center">
    <div>
      <div style="font-size:24px;font-weight:700">ДомСтрой</div>
      <div style="font-size:11px;opacity:0.75;margin-top:3px">Каркасные дома под ключ с 2007 года</div>
    </div>
    <div style="text-align:right;font-size:11px;opacity:0.9;line-height:1.8">
      <div>+7 (499) 123-45-67</div><div>info@domstroy.ru</div><div>domstroy.ru</div>
    </div>
  </div>

  <!-- TITLE -->
  <div style="text-align:center;padding:22px 28px 16px">
    <div style="font-size:19px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#1B5E20">СМЕТА НА СТРОИТЕЛЬСТВО</div>
    <div style="font-size:12px;color:#6b7280;margin-top:5px">Дата: ${date}</div>
  </div>

  <!-- PROJECT INFO -->
  <div style="padding:0 28px 18px">
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px">
      <div style="font-size:13px;font-weight:700;color:#166534;margin-bottom:10px;text-transform:uppercase">Информация о проекте</div>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:4px 0;color:#4b5563;font-size:13px;width:45%">Проект:</td><td style="padding:4px 0;font-weight:600;font-size:13px">${data.projectName}</td></tr>
        <tr><td style="padding:4px 0;color:#4b5563;font-size:13px">Площадь:</td><td style="padding:4px 0;font-weight:600;font-size:13px">${data.projectArea} м²</td></tr>
        <tr><td style="padding:4px 0;color:#4b5563;font-size:13px">Комплектация:</td><td style="padding:4px 0;font-weight:600;font-size:13px">${COMPLETION_LABELS[data.completionType]}</td></tr>
        ${optionsRow}
      </table>
    </div>
  </div>

  <!-- BREAKDOWN -->
  <div style="padding:0 28px 18px">
    <div style="font-size:13px;font-weight:700;margin-bottom:8px;text-transform:uppercase">Разбор по статьям</div>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb">
      <thead>
        <tr style="background:#f3f4f6">
          <th style="padding:10px 14px;text-align:left;font-size:12px;font-weight:600;color:#374151;text-transform:uppercase">Статья расходов</th>
          <th style="padding:10px 14px;text-align:right;font-size:12px;font-weight:600;color:#374151;text-transform:uppercase">Сумма, ₽</th>
        </tr>
      </thead>
      <tbody>
        ${buildBreakdownRows(data.priceBreakdown)}
        <tr style="background:#1B5E20">
          <td style="padding:12px 14px;font-size:14px;font-weight:700;color:#fff">ИТОГО</td>
          <td style="padding:12px 14px;text-align:right;font-size:16px;font-weight:700;color:#fff">${fmt(data.totalPrice)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- FINANCING -->
  <div style="padding:0 28px 18px">
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px 20px">
      <div style="font-size:13px;font-weight:700;color:#1e40af;margin-bottom:8px;text-transform:uppercase">Варианты финансирования</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-size:13px;color:#374151">Примерный ежемесячный платёж:</span>
        <span style="font-size:18px;font-weight:700;color:#1e40af">${fmt(data.monthlyPayment)}/мес</span>
      </div>
      <div style="font-size:12px;color:#6b7280">~8% годовых · срок 15–20 лет · Сбер, ВТБ, ДОМ.РФ · семейная ипотека от 5%</div>
    </div>
  </div>

  <!-- DISCLAIMER -->
  <div style="margin:0 28px 18px;padding:12px 16px;background:#fef9c3;border:1px solid #fde68a;border-radius:8px;font-size:12px;color:#78350f;line-height:1.6">
    <strong>⚠ Важно:</strong> Настоящая смета является предварительной. Точная стоимость определяется после выезда специалиста на участок.
  </div>

  <!-- FOOTER -->
  <div style="margin:0 28px;padding:16px 0;border-top:2px solid #e5e7eb;display:flex;justify-content:space-between;align-items:flex-end">
    <div style="font-size:11px;color:#6b7280;line-height:1.7">
      <div style="font-weight:600;color:#374151;margin-bottom:2px">ДомСтрой — ООО «Стройгрупп»</div>
      <div>ИНН: 7701234567 · ОГРН: 1077701234567</div>
      <div>+7 (499) 123-45-67 · info@domstroy.ru</div>
    </div>
    <div style="text-align:right;font-size:11px;color:#6b7280;line-height:1.7">
      <div>Смета действительна до: <strong style="color:#374151">${expiry}</strong></div>
    </div>
  </div>

</div>
</body>
</html>`
}

/* ─── Main export ────────────────────────────────────────────────────────────── */

/**
 * Generates a PDF smeta from QuoteData using Puppeteer (headless Chrome).
 * Returns a Buffer suitable for HTTP streaming or email attachment.
 */
export async function generateQuotePDFServer(data: QuoteData): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setContent(buildHtml(data), { waitUntil: 'networkidle0' })
    await page.emulateMediaType('screen')

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', right: '0', bottom: '10mm', left: '0' },
    })

    return Buffer.from(pdfBuffer)
  } finally {
    await browser.close()
  }
}

/**
 * Builds a filename for the PDF: smeta_<slug>_YYYY-MM-DD.pdf
 */
export function buildQuoteFilename(projectName: string, date: Date): string {
  const d = date
  const yyyy = d.getFullYear()
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const dd   = String(d.getDate()).padStart(2, '0')
  return `smeta_${slugify(projectName)}_${yyyy}-${mm}-${dd}.pdf`
}
