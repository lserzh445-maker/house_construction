/**
 * Email integration — заглушка (stub).
 *
 * Real implementation options:
 *   A) SendGrid: npm install @sendgrid/mail
 *      Set SENDGRID_API_KEY + EMAIL_FROM in .env
 *
 *   B) Amazon SES: npm install @aws-sdk/client-ses
 *      Set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY in .env
 *
 *   C) Nodemailer (SMTP): npm install nodemailer
 *      Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env
 */

export interface EmailOptions {
  to: string
  subject: string
  html: string
  attachments?: { filename: string; content: Buffer | string }[]
}

/**
 * Sends an email. Currently logs to console (stub).
 *
 * Replace stub body with e.g. SendGrid:
 *   import sgMail from '@sendgrid/mail'
 *   sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
 *   await sgMail.send({ from: process.env.EMAIL_FROM!, ...options })
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('[Email] STUB — would send email:', {
      to: options.to,
      subject: options.subject,
    })
    return
  }

  // TODO: replace with real SendGrid / SES / Nodemailer call
  console.log('[Email] Sending to:', options.to, '|', options.subject)
}

// ─── Email templates ──────────────────────────────────────────────────────────

/** Sent to client after a call-back request */
export function callConfirmationEmail(name: string, leadId: string): EmailOptions {
  return {
    to: '',
    subject: 'Ваша заявка на звонок принята — ДомСтрой',
    html: `
      <h2>Здравствуйте, ${name}!</h2>
      <p>Мы получили вашу заявку (№${leadId}) и свяжемся с вами в течение <strong>30 минут</strong> в рабочее время.</p>
      <p>Если у вас срочный вопрос, позвоните нам: <a href="tel:+74991234567">+7 (499) 123-45-67</a></p>
      <hr/>
      <p style="color:#888;font-size:12px">ДомСтрой — каркасные дома под ключ</p>
    `,
  }
}

/** Sent to client after a quote request (with PDF attachment placeholder) */
export function quoteConfirmationEmail(
  name: string,
  email: string,
  projectName: string,
  leadId: string,
): EmailOptions {
  return {
    to: email,
    subject: `Расчёт стоимости дома «${projectName}» — ДомСтрой`,
    html: `
      <h2>Здравствуйте, ${name}!</h2>
      <p>Спасибо за интерес к проекту <strong>${projectName}</strong>.</p>
      <p>К письму прикреплена предварительная смета (PDF). Наш менеджер свяжется с вами в течение 2 часов для уточнения деталей.</p>
      <p>Номер заявки: <strong>${leadId}</strong></p>
      <hr/>
      <p style="color:#888;font-size:12px">ДомСтрой — каркасные дома под ключ | <a href="https://domstroy.ru">domstroy.ru</a></p>
    `,
    // In real implementation: attach generated PDF
    // attachments: [{ filename: `estimate-${leadId}.pdf`, content: pdfBuffer }],
  }
}

/** Sent to the manager about a new high-priority lead */
export function managerNotificationEmail(
  managerEmail: string,
  leadId: string,
  type: string,
  name: string,
  phone: string,
): EmailOptions {
  return {
    to: managerEmail,
    subject: `🏠 Новая заявка: ${type} — ${name}`,
    html: `
      <h3>Новая заявка с сайта</h3>
      <table>
        <tr><td><b>ID</b></td><td>${leadId}</td></tr>
        <tr><td><b>Тип</b></td><td>${type}</td></tr>
        <tr><td><b>Имя</b></td><td>${name}</td></tr>
        <tr><td><b>Телефон</b></td><td><a href="tel:${phone}">${phone}</a></td></tr>
      </table>
      <p><a href="https://your_company.bitrix24.ru/crm/lead/">Открыть в Bitrix24</a></p>
    `,
  }
}
