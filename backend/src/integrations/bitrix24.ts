/**
 * Bitrix24 CRM integration — заглушка (stub).
 *
 * Real implementation:
 * 1. Set BITRIX24_WEBHOOK_URL in .env
 *    Example: https://your_company.bitrix24.ru/rest/1/your_webhook_token/
 * 2. Replace the stub body with actual fetch calls to the Bitrix24 REST API.
 *    Docs: https://dev.1c-bitrix.ru/rest_api/
 */

import type { ContactLead } from '../types'

interface Bitrix24Lead {
  TITLE: string
  NAME: string
  PHONE: { VALUE: string; VALUE_TYPE: 'WORK' }[]
  EMAIL?: { VALUE: string; VALUE_TYPE: 'WORK' }[]
  COMMENTS?: string
  SOURCE_ID: string    // 'WEB' for website leads
  STATUS_ID: string    // 'NEW'
  UF_CRM_SOURCE?: string // custom field: form type
}

/**
 * Creates a lead in Bitrix24.
 * Returns the CRM lead ID on success, or null if the integration is disabled.
 *
 * Replace the stub body with:
 *   const response = await fetch(`${WEBHOOK_URL}/crm.lead.add.json`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ fields: payload }),
 *   })
 *   const json = await response.json()
 *   return json.result?.toString() ?? null
 */
export async function createBitrix24Lead(lead: ContactLead): Promise<string | null> {
  const webhookUrl = process.env.BITRIX24_WEBHOOK_URL

  if (!webhookUrl) {
    // Integration not configured — log and skip gracefully
    console.log('[Bitrix24] STUB — webhook URL not set. Lead would be sent:', {
      name: lead.name,
      phone: lead.phone,
      type: lead.type,
    })
    return null
  }

  const payload: Bitrix24Lead = {
    TITLE: `Заявка с сайта: ${typeLabel(lead.type)} — ${lead.name}`,
    NAME: lead.name,
    PHONE: [{ VALUE: lead.phone, VALUE_TYPE: 'WORK' }],
    ...(lead.email ? { EMAIL: [{ VALUE: lead.email, VALUE_TYPE: 'WORK' }] } : {}),
    COMMENTS: buildComment(lead),
    SOURCE_ID: 'WEB',
    STATUS_ID: 'NEW',
    UF_CRM_SOURCE: lead.type,
  }

  try {
    const response = await fetch(`${webhookUrl}/crm.lead.add.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: payload }),
    })

    if (!response.ok) {
      console.error('[Bitrix24] HTTP error', response.status)
      return null
    }

    const json = (await response.json()) as { result?: number }
    const crmId = json.result?.toString() ?? null
    console.log('[Bitrix24] Lead created:', crmId)
    return crmId
  } catch (err) {
    // CRM errors must not break form submission — log and continue
    console.error('[Bitrix24] Failed to create lead:', err)
    return null
  }
}

/**
 * Sends a notification to the responsible manager via Bitrix24 messenger.
 * Requires a bot token configured in the portal.
 */
export async function notifyManager(leadId: string, message: string): Promise<void> {
  const webhookUrl = process.env.BITRIX24_WEBHOOK_URL
  const userId     = process.env.BITRIX24_MANAGER_ID  // responsible user ID

  if (!webhookUrl || !userId) {
    console.log('[Bitrix24] STUB — manager notification:', { leadId, message })
    return
  }

  try {
    await fetch(`${webhookUrl}/im.message.add.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        DIALOG_ID: userId,
        MESSAGE: `🏠 Новая заявка #${leadId}\n${message}`,
      }),
    })
  } catch (err) {
    console.error('[Bitrix24] Failed to notify manager:', err)
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function typeLabel(type: ContactLead['type']): string {
  const map: Record<ContactLead['type'], string> = {
    'call': 'Заказать звонок',
    'quote': 'Получить расчёт',
    'consultation': 'Консультация',
    'custom-project': 'Индивидуальный проект',
  }
  return map[type] ?? type
}

function buildComment(lead: ContactLead): string {
  const lines: string[] = []
  if (lead.project)       lines.push(`Проект: ${lead.project}`)
  if (lead.configuration) lines.push(`Комплектация: ${lead.configuration}`)
  if (lead.message)       lines.push(`Сообщение: ${lead.message}`)
  return lines.join('\n')
}
