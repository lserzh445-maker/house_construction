/**
 * generate-quote-pdf.ts
 *
 * Client-side PDF generation for the construction cost estimate (смета).
 * Uses html2pdf.js (browser-only) via a dynamic import to avoid SSR issues.
 *
 * Usage:
 *   const data: CalculatorData = { ... }
 *   await generateQuotePDF(data)   // triggers download
 */

/* ─── Public types ───────────────────────────────────────────────────────── */

export type CompletionType = 'without_finishing' | 'with_finishing' | 'turnkey'

export type OptionId = 'delivery' | 'foundation' | 'utilities' | 'insurance'

export interface PriceBreakdown {
  /** Base project cost (materials 40%) */
  materials:   number
  /** Base project cost (labor 30%) */
  labor:       number
  /** Base project cost (overhead 30%) */
  overhead:    number
  delivery?:   number
  foundation?: number
  utilities?:  number
  insurance?:  number
}

export interface CalculatorData {
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

/* ─── Internal helpers ───────────────────────────────────────────────────── */

function fmt(n: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style:                 'currency',
    currency:              'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function slugify(s: string): string {
  return s
    .replace(/[а-яё]/gi, (c) => TRANSLIT[c.toLowerCase()] ?? c)
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase()
    .slice(0, 30)
}

function docNumber(d: Date): string {
  // 6-digit number derived from timestamp, e.g. "041523"
  const h  = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  const s  = String(d.getSeconds()).padStart(2, '0')
  return h + mi + s
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

/** Partial Cyrillic → Latin transliteration for filenames */
const TRANSLIT: Record<string, string> = {
  а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'yo', ж:'zh',
  з:'z', и:'i', й:'y', к:'k', л:'l', м:'m', н:'n', о:'o',
  п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f', х:'kh', ц:'ts',
  ч:'ch', ш:'sh', щ:'shch', ъ:'', ы:'y', ь:'', э:'e', ю:'yu', я:'ya',
}

/* ─── HTML template ──────────────────────────────────────────────────────── */

function buildBreakdownRows(bd: PriceBreakdown): string {
  const rows: [string, number][] = [
    ['Материалы',                    bd.materials],
    ['Работа строителей',            bd.labor],
    ['Накладные расходы',            bd.overhead],
  ]
  if (bd.delivery   != null) rows.push(['Доставка на участок',      bd.delivery])
  if (bd.foundation != null) rows.push(['Монтаж фундамента',         bd.foundation])
  if (bd.utilities  != null) rows.push(['Подключение коммуникаций',  bd.utilities])
  if (bd.insurance  != null) rows.push(['Страховка (3%)',            bd.insurance])

  return rows
    .map(
      ([label, value], idx) => `
      <tr style="background:${idx % 2 === 0 ? '#fff' : '#f9fafb'}">
        <td style="padding:9px 14px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#374151">${label}</td>
        <td style="padding:9px 14px;border-bottom:1px solid #e5e7eb;text-align:right;font-size:13px;color:#374151;white-space:nowrap">${fmt(value)}</td>
      </tr>`,
    )
    .join('')
}

function buildSmetaHtml(data: CalculatorData): string {
  const docNo  = docNumber(data.generatedAt)
  const date   = fmtDate(data.generatedAt)
  const expiry = fmtDate(new Date(data.generatedAt.getTime() + 30 * 24 * 3600 * 1000))
  const completionLabel = COMPLETION_LABELS[data.completionType]

  return `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;width:794px;box-sizing:border-box">

  <!-- ── HEADER ── -->
  <div style="background:#1B5E20;color:#fff;padding:20px 28px;display:flex;justify-content:space-between;align-items:center">
    <div>
      <div style="font-size:24px;font-weight:700;letter-spacing:1px">ДомСтрой</div>
      <div style="font-size:11px;opacity:0.75;margin-top:3px">Каркасные дома под ключ с 2007 года</div>
    </div>
    <div style="text-align:right;font-size:11px;opacity:0.9;line-height:1.7">
      <div>+7 (499) 123-45-67</div>
      <div>info@domstroy.ru</div>
      <div>domstroy.ru</div>
    </div>
  </div>

  <!-- ── TITLE ── -->
  <div style="text-align:center;padding:22px 28px 16px">
    <div style="font-size:19px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#1B5E20">СМЕТА НА СТРОИТЕЛЬСТВО</div>
    <div style="font-size:12px;color:#6b7280;margin-top:5px">Документ №${docNo} · Дата: ${date}</div>
  </div>

  <!-- ── PROJECT INFO ── -->
  <div style="padding:0 28px 18px">
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px">
      <div style="font-size:13px;font-weight:700;color:#166534;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px">Информация о проекте</div>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:4px 0;color:#4b5563;font-size:13px;width:45%">Проект:</td>
          <td style="padding:4px 0;font-weight:600;font-size:13px">${data.projectName}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#4b5563;font-size:13px">Площадь:</td>
          <td style="padding:4px 0;font-weight:600;font-size:13px">${data.projectArea} м²</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#4b5563;font-size:13px">Комплектация:</td>
          <td style="padding:4px 0;font-weight:600;font-size:13px">${completionLabel}</td>
        </tr>
        ${data.selectedOptions.length > 0 ? `
        <tr>
          <td style="padding:4px 0;color:#4b5563;font-size:13px;vertical-align:top">Дополнительно:</td>
          <td style="padding:4px 0;font-weight:600;font-size:13px">${data.selectedOptions.map((o) => OPTION_LABELS[o]).join(', ')}</td>
        </tr>` : ''}
      </table>
    </div>
  </div>

  <!-- ── BREAKDOWN TABLE ── -->
  <div style="padding:0 28px 18px">
    <div style="font-size:13px;font-weight:700;color:#111;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Разбор по статьям</div>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
      <thead>
        <tr style="background:#f3f4f6">
          <th style="padding:10px 14px;text-align:left;font-size:12px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.5px">Статья расходов</th>
          <th style="padding:10px 14px;text-align:right;font-size:12px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.5px">Сумма, ₽</th>
        </tr>
      </thead>
      <tbody>
        ${buildBreakdownRows(data.priceBreakdown)}
        <!-- Total row -->
        <tr style="background:#1B5E20">
          <td style="padding:12px 14px;font-size:14px;font-weight:700;color:#fff">ИТОГО</td>
          <td style="padding:12px 14px;text-align:right;font-size:16px;font-weight:700;color:#fff;white-space:nowrap">${fmt(data.totalPrice)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ── FINANCING ── -->
  <div style="padding:0 28px 18px">
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px 20px">
      <div style="font-size:13px;font-weight:700;color:#1e40af;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px">Варианты финансирования</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-size:13px;color:#374151">Примерный ежемесячный платёж:</span>
        <span style="font-size:18px;font-weight:700;color:#1e40af">${fmt(data.monthlyPayment)}/мес</span>
      </div>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:3px 0;color:#6b7280;font-size:12px">Процентная ставка:</td>
          <td style="padding:3px 0;font-size:12px;text-align:right">~8% годовых (Сбер, ВТБ, ДОМ.РФ)</td>
        </tr>
        <tr>
          <td style="padding:3px 0;color:#6b7280;font-size:12px">Срок кредитования:</td>
          <td style="padding:3px 0;font-size:12px;text-align:right">15–20 лет (в зависимости от банка)</td>
        </tr>
        <tr>
          <td style="padding:3px 0;color:#6b7280;font-size:12px">Господдержка:</td>
          <td style="padding:3px 0;font-size:12px;text-align:right">Семейная ипотека от 5%</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- ── CONDITIONS ── -->
  <div style="padding:0 28px 18px">
    <div style="font-size:13px;font-weight:700;color:#111;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Условия и гарантии</div>
    <table style="width:100%;border-collapse:collapse">
      ${[
        ['Срок строительства',              '4–6 недель с момента подписания договора'],
        ['Гарантия на силовой каркас',      '25 лет'],
        ['Гарантия на работы',              '3 года'],
        ['Доставка',                        'Включена в радиусе до 500 км от Москвы'],
        ['Предоплата',                      '30% при подписании договора'],
        ['Оплата по этапам',                'Разбивка возможна, обсуждается индивидуально'],
      ].map(([k, v], i) => `
      <tr style="background:${i % 2 === 0 ? '#f9fafb' : '#fff'}">
        <td style="padding:7px 10px;font-size:12px;color:#4b5563;width:40%">${k}:</td>
        <td style="padding:7px 10px;font-size:12px;font-weight:500">${v}</td>
      </tr>`).join('')}
    </table>
  </div>

  <!-- ── DISCLAIMER ── -->
  <div style="margin:0 28px 18px;padding:12px 16px;background:#fef9c3;border:1px solid #fde68a;border-radius:8px">
    <div style="font-size:12px;color:#78350f;line-height:1.6">
      <strong>⚠ Важно:</strong> Настоящая смета является предварительной и составлена на основе стандартных нормативов.
      Точная стоимость определяется после выезда специалиста на участок и может отличаться
      в зависимости от типа фундамента, рельефа участка и индивидуальных пожеланий.
    </div>
  </div>

  <!-- ── FOOTER ── -->
  <div style="margin:0 28px;padding:16px 0;border-top:2px solid #e5e7eb;display:flex;justify-content:space-between;align-items:flex-end">
    <div style="font-size:11px;color:#6b7280;line-height:1.6">
      <div style="font-weight:600;color:#374151;margin-bottom:4px">ДомСтрой — ООО «Стройгрупп»</div>
      <div>ИНН: 7701234567 · ОГРН: 1077701234567</div>
      <div>Тел: +7 (499) 123-45-67 · info@domstroy.ru</div>
      <div>г. Москва, ул. Строителей, д. 1, офис 101</div>
    </div>
    <div style="text-align:right;font-size:11px;color:#6b7280;line-height:1.6">
      <div>Смета действительна до: <strong style="color:#374151">${expiry}</strong></div>
      <div style="margin-top:2px">Дата генерации: ${date}</div>
      <div style="margin-top:12px;border-top:1px solid #d1d5db;padding-top:8px;font-style:italic">Подпись уполномоченного лица</div>
      <div style="margin-top:20px;border-bottom:1px solid #374151;width:180px;display:inline-block"></div>
    </div>
  </div>

  <div style="height:20px"></div>
</div>`
}

/* ─── Main export ────────────────────────────────────────────────────────── */

/**
 * Generates and downloads a PDF smeta document.
 * Must be called from a browser context (not SSR).
 *
 * @throws {Error} if called on the server or if generation fails
 */
export async function generateQuotePDF(data: CalculatorData): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('generateQuotePDF must be called from a browser context')
  }

  // Dynamic import — keeps html2pdf.js out of the SSR bundle
  const { default: html2pdf } = await import('html2pdf.js')

  const filename =
    `smeta_${slugify(data.projectName)}_${data.generatedAt.getFullYear()}-` +
    `${String(data.generatedAt.getMonth() + 1).padStart(2, '0')}-` +
    `${String(data.generatedAt.getDate()).padStart(2, '0')}.pdf`

  // Create an off-viewport container that html2canvas can still measure.
  // position:fixed + top:0 keeps it inside the viewport (left:-9999px does not).
  // opacity:0.01 makes it invisible without using display:none (which blocks capture).
  const container = document.createElement('div')
  container.innerHTML = buildSmetaHtml(data)
  container.style.cssText =
    'position:fixed;top:0;left:0;width:794px;' +
    'z-index:-9999;pointer-events:none;opacity:0.01;overflow:hidden'
  document.body.appendChild(container)

  try {
    await html2pdf()
      .set({
        margin:      [10, 0, 10, 0],   // top, right, bottom, left (mm)
        filename,
        image:       { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
        enableLinks: false,
      })
      .from(container)
      .save()
  } finally {
    document.body.removeChild(container)
  }
}
