import { z } from 'zod'

/* ─── Reusable field validators ─────────────────────────────────────────── */

const nameField = z
  .string({ required_error: 'Пожалуйста, введите имя' })
  .min(2, 'Имя должно содержать минимум 2 символа')
  .max(100, 'Имя не должно превышать 100 символов')
  .trim()

const phoneField = z
  .string({ required_error: 'Пожалуйста, введите номер телефона' })
  .trim()
  .refine(
    (val) => /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/.test(val),
    'Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX',
  )

const emailField = z
  .string({ required_error: 'Пожалуйста, введите email' })
  .trim()
  .email('Введите корректный email')
  .max(254, 'Email слишком длинный')

const optionalEmailField = z
  .string()
  .trim()
  .email('Введите корректный email')
  .max(254, 'Email слишком длинный')
  .or(z.literal(''))
  .optional()

const consentField = z
  .boolean({ required_error: 'Согласие обязательно' })
  .refine((val) => val === true, 'Необходимо дать согласие на обработку персональных данных')

/* ─── Schema 1: Заказать звонок ─────────────────────────────────────────── */

export const callFormSchema = z.object({
  name:      nameField,
  phone:     phoneField,
  projectId: z.string().optional(),
  consent:   consentField,
})

export type CallFormData = z.infer<typeof callFormSchema>

/* ─── Schema 2: Получить расчёт ─────────────────────────────────────────── */

export const quoteFormSchema = z.object({
  name:           nameField,
  email:          emailField,
  phone:          phoneField,
  projectId:      z
    .string({ required_error: 'Выберите проект' })
    .min(1, 'Выберите проект'),
  completionType: z.enum(['without_finishing', 'with_finishing', 'turnkey'], {
    required_error: 'Выберите комплектацию',
    invalid_type_error: 'Выберите комплектацию',
  }),
  consent:        consentField,
})

export type QuoteFormData = z.infer<typeof quoteFormSchema>

/* ─── Schema 3: Консультация ─────────────────────────────────────────────── */

export const consultationFormSchema = z.object({
  name:     nameField,
  phone:    phoneField,
  email:    optionalEmailField,
  dateTime: z
    .string({ required_error: 'Выберите дату и время' })
    .min(1, 'Выберите дату и время')
    .refine((val) => {
      const d = new Date(val)
      return !isNaN(d.getTime()) && d > new Date()
    }, 'Выберите будущую дату'),
  location: z.enum(['office', 'exhibition'], {
    required_error: 'Выберите место консультации',
    invalid_type_error: 'Выберите место консультации',
  }),
  topic:    z
    .string()
    .max(500, 'Тема не должна превышать 500 символов')
    .optional(),
  consent:  consentField,
})

export type ConsultationFormData = z.infer<typeof consultationFormSchema>

/* ─── Schema 4: Индивидуальный проект ───────────────────────────────────── */

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf', 'dwg'] as const
const MAX_TOTAL_SIZE_MB   = 10
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024

export const projectFormSchema = z.object({
  name:         nameField,
  phone:        phoneField,
  email:        emailField,
  desiredArea:  z
    .number()
    .min(30, 'Минимальная площадь — 30 м²')
    .max(500, 'Максимальная площадь — 500 м²')
    .optional(),
  bedrooms:     z
    .number()
    .int('Введите целое число')
    .min(1, 'Минимум 1 комната')
    .max(10, 'Максимум 10 комнат')
    .optional(),
  requirements: z
    .string()
    .max(1000, 'Описание не должно превышать 1000 символов')
    .optional(),
  files:        z
    .custom<FileList>()
    .refine((files) => {
      if (!files || files.length === 0) return true
      return Array.from(files).every((file) => {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
        return (ALLOWED_EXTENSIONS as readonly string[]).includes(ext)
      })
    }, `Допустимые форматы: ${ALLOWED_EXTENSIONS.join(', ').toUpperCase()}`)
    .refine((files) => {
      if (!files || files.length === 0) return true
      const total = Array.from(files).reduce((sum, f) => sum + f.size, 0)
      return total <= MAX_TOTAL_SIZE_BYTES
    }, `Общий размер файлов не должен превышать ${MAX_TOTAL_SIZE_MB} МБ`)
    .optional(),
  consent:      consentField,
})

export type ProjectFormData = z.infer<typeof projectFormSchema>

/* ─── Completion type labels ─────────────────────────────────────────────── */

export const COMPLETION_TYPE_LABELS: Record<QuoteFormData['completionType'], string> = {
  without_finishing: 'Без отделки',
  with_finishing:    'С отделкой',
  turnkey:           'Под ключ',
}
