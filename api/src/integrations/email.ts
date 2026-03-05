/**
 * Email integration via Nodemailer (SMTP).
 *
 * Configure in api/.env:
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_USER=your-email@gmail.com
 *   SMTP_PASS=your-app-password   ← Gmail: Settings → Security → App passwords
 *   EMAIL_FROM=your-email@gmail.com
 *   MANAGER_EMAIL=manager@yourcompany.ru
 */

import nodemailer from 'nodemailer'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  attachments?: { filename: string; content: Buffer | string }[]
}

function createTransport() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT) || 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const transport = createTransport()

  if (!transport) {
    console.log('[Email] STUB (SMTP not configured) — would send:', {
      to: options.to,
      subject: options.subject,
    })
    console.log('[Email] Set SMTP_HOST, SMTP_USER, SMTP_PASS in api/.env to enable real sending')
    return
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER!

  await transport.sendMail({
    from: `"ДомСтрой" <${from}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments?.map((att) => ({
      filename: att.filename,
      content: att.content,
    })),
  })

  console.log(`[Email] ✅ Sent to: ${options.to} | ${options.subject}`)
}

// ─── Email templates ──────────────────────────────────────────────────────────

export function callConfirmationEmail(name: string, emailOrLeadId: string, leadId?: string): EmailOptions {
  // Support both (name, email, leadId) and legacy (name, leadId) signatures
  const to = leadId ? emailOrLeadId : ''
  const id = leadId ?? emailOrLeadId
  return {
    to,
    subject: 'Ваша заявка на звонок принята — ДомСтрой',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1B5E20;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0">
          <h2 style="margin:0;font-size:20px">ДомСтрой</h2>
          <p style="margin:4px 0 0;font-size:12px;opacity:0.8">Каркасные дома под ключ</p>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#1B5E20;margin-top:0">Здравствуйте, ${name}!</h3>
          <p>Мы получили вашу заявку <strong>№${id}</strong> и свяжемся с вами в течение <strong>30 минут</strong> в рабочее время.</p>
          <p>Если у вас срочный вопрос, позвоните нам: <a href="tel:+74991234567" style="color:#1B5E20">+7 (499) 123-45-67</a></p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
          <p style="color:#888;font-size:12px;margin:0">ДомСтрой — каркасные дома под ключ | <a href="https://domstroy.ru" style="color:#888">domstroy.ru</a></p>
        </div>
      </div>
    `,
  }
}

export function quoteConfirmationEmail(
  name: string,
  email: string,
  projectName: string,
  leadId: string,
  pdfBuffer?: Buffer,
): EmailOptions {
  return {
    to: email,
    subject: `Расчёт стоимости дома «${projectName}» — ДомСтрой`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1B5E20;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0">
          <h2 style="margin:0;font-size:20px">ДомСтрой</h2>
          <p style="margin:4px 0 0;font-size:12px;opacity:0.8">Каркасные дома под ключ</p>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#1B5E20;margin-top:0">Здравствуйте, ${name}!</h3>
          <p>Спасибо за интерес к проекту <strong>«${projectName}»</strong>.</p>
          <p>${pdfBuffer ? 'К письму прикреплена предварительная <strong>смета в PDF</strong>.' : 'Смета будет подготовлена вскоре.'} Наш менеджер свяжется с вами в течение <strong>2 часов</strong> для уточнения деталей.</p>
          <p><strong>Номер заявки:</strong> ${leadId}</p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:0 0 8px;font-weight:bold;color:#166534">Контакты для связи:</p>
            <p style="margin:4px 0">📞 <a href="tel:+74991234567" style="color:#1B5E20">+7 (499) 123-45-67</a></p>
            <p style="margin:4px 0">✉️ <a href="mailto:info@domstroy.ru" style="color:#1B5E20">info@domstroy.ru</a></p>
            <p style="margin:4px 0">💬 <a href="https://wa.me/74991234567" style="color:#1B5E20">WhatsApp</a></p>
          </div>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
          <p style="color:#888;font-size:12px;margin:0">ДомСтрой — ООО «Стройгрупп» | <a href="https://domstroy.ru" style="color:#888">domstroy.ru</a></p>
        </div>
      </div>
    `,
    ...(pdfBuffer && {
      attachments: [{ filename: `smeta_${leadId}.pdf`, content: pdfBuffer }],
    }),
  }
}

export function managerNotificationEmail(
  managerEmail: string,
  leadId: string,
  type: string,
  name: string,
  phone: string,
  extra?: Record<string, string>,
): EmailOptions {
  const extraRows = extra
    ? Object.entries(extra)
        .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${v}</td></tr>`)
        .join('')
    : ''

  return {
    to: managerEmail,
    subject: `🏠 Новая заявка: ${type} — ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px">
        <h3 style="color:#1B5E20">Новая заявка с сайта</h3>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:6px 12px;background:#f3f4f6"><b>ID</b></td><td style="padding:6px 12px">${leadId}</td></tr>
          <tr><td style="padding:6px 12px;background:#f3f4f6"><b>Тип</b></td><td style="padding:6px 12px">${type}</td></tr>
          <tr><td style="padding:6px 12px;background:#f3f4f6"><b>Имя</b></td><td style="padding:6px 12px">${name}</td></tr>
          <tr><td style="padding:6px 12px;background:#f3f4f6"><b>Телефон</b></td><td style="padding:6px 12px"><a href="tel:${phone}">${phone}</a></td></tr>
          ${extraRows}
        </table>
      </div>
    `,
  }
}
