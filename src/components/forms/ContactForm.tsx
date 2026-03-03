import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Phone, Mail, MapPin, Clock,
  MessageCircle, Send, CheckCircle2,
  ChevronDown,
} from 'lucide-react'
import { fadeInLeft, fadeInRight, fadeInUp, stagger, viewport } from '@/lib/animations'
import { contactsApi } from '@/lib/api'

/* ─── Zod schema ─────────────────────────────────────────────────────── */
const schema = z.object({
  name: z.string().min(2, 'Введите имя (минимум 2 символа)'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email').or(z.literal('')).optional(),
  project: z.string().optional(),
  message: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Необходимо дать согласие на обработку данных' }),
  }),
})

type FormData = z.infer<typeof schema>

/* ─── Props ──────────────────────────────────────────────────────────── */
export interface ContactFormProps {
  className?: string
  defaultProject?: string
  compact?: boolean
}

/* ─── Contact info items ─────────────────────────────────────────────── */
const CONTACT_ITEMS = [
  {
    icon: Phone,
    label: 'Телефон',
    value: '+7 (499) 123-45-67',
    href: 'tel:+74991234567',
    hint: 'Звонок бесплатный',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@domstroy.ru',
    href: 'mailto:info@domstroy.ru',
    hint: 'Ответим в течение 2 часов',
  },
  {
    icon: MapPin,
    label: 'Офис',
    value: 'Москва, ул. Строительная, 17',
    href: 'https://maps.google.com',
    hint: 'Выставочный комплекс рядом',
  },
  {
    icon: Clock,
    label: 'Время работы',
    value: 'Пн–Сб: 9:00 – 20:00',
    hint: 'Воскресенье — выходной',
  },
]

/* ─── Project options ────────────────────────────────────────────────── */
const PROJECT_OPTIONS = [
  { value: '', label: 'Не выбран' },
  { value: 'fin-d5', label: 'Финский дом Д-5 — 85 м²' },
  { value: 'modern-m1', label: 'Современный М-1 — 65 м²' },
  { value: 'barn-b3', label: 'Барнхаус Б-3 — 120 м²' },
  { value: 'canadian-k2', label: 'Канадский К-2 — 100 м²' },
  { value: 'economy-e1', label: 'Эконом Е-1 — 45 м²' },
  { value: 'custom', label: 'Индивидуальный проект' },
]

/* ─── Success screen ─────────────────────────────────────────────────── */
function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center text-center py-10 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.15 }}
        className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-5"
      >
        <CheckCircle2 size={40} className="text-primary" />
      </motion.div>
      <h3 className="font-heading font-bold text-2xl text-neutral-dark mb-2">
        Заявка отправлена!
      </h3>
      <p className="text-neutral-medium text-sm leading-relaxed mb-6 max-w-xs">
        Наш менеджер свяжется с вами в течение 30 минут в рабочее время.
        Мы уже ждём вашего звонка!
      </p>
      <button
        onClick={onReset}
        className="text-primary text-sm font-medium underline-offset-2 hover:underline"
      >
        Отправить ещё одну заявку
      </button>
    </motion.div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function ContactForm({
  className = '',
  defaultProject = '',
  compact = false,
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { project: defaultProject, consent: undefined },
  })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      await contactsApi.submitCall({
        name: data.name,
        phone: data.phone,
        project: data.project,
      })
      setSubmitted(true)
      reset()
    } catch {
      setServerError('Произошла ошибка. Попробуйте позвонить напрямую.')
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setServerError(null)
  }

  return (
    <section
      className={`section-padding bg-neutral-dark text-white ${className}`}
      aria-labelledby="contact-title"
    >
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 ${compact ? '' : 'lg:grid-cols-2'} gap-12 items-start`}>

          {/* ── Left: contact info ───────────────────────────────────── */}
          {!compact && (
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <motion.span
                variants={fadeInUp}
                className="text-accent font-semibold text-sm uppercase tracking-widest"
              >
                Контакты
              </motion.span>
              <motion.h2
                variants={fadeInLeft}
                id="contact-title"
                className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-4 text-white"
              >
                Готовы ответить на&nbsp;все вопросы
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-white/70 leading-relaxed mb-8"
              >
                Оставьте заявку — мы позвоним в течение 30 минут и бесплатно
                рассчитаем стоимость вашего будущего дома.
              </motion.p>

              {/* Contact items */}
              <motion.ul variants={stagger(0.08)} className="space-y-5 mb-8">
                {CONTACT_ITEMS.map(({ icon: Icon, label, value, href, hint }) => (
                  <motion.li
                    key={label}
                    variants={fadeInLeft}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wider mb-0.5">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith('http') ? '_blank' : undefined}
                          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-white font-medium hover:text-accent transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-white font-medium">{value}</p>
                      )}
                      {hint && <p className="text-xs text-white/50 mt-0.5">{hint}</p>}
                    </div>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Messenger buttons */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/74991234567?text=Здравствуйте!%20Интересуюсь%20каркасными%20домами."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
                <a
                  href="https://t.me/domstroy_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0088cc] hover:bg-[#006ea6] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                >
                  <Send size={16} />
                  Telegram
                </a>
              </motion.div>
            </motion.div>
          )}

          {/* ── Right: form ──────────────────────────────────────────── */}
          <motion.div
            variants={compact ? stagger() : fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

              {/* Card header */}
              <div className="bg-primary px-6 py-4">
                <h3 className="font-heading font-semibold text-white text-lg">
                  Получить бесплатный расчёт
                </h3>
                <p className="text-primary-100 text-sm mt-0.5">
                  Ответим в течение 30 минут в рабочее время
                </p>
              </div>

              {/* Card body */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <SuccessScreen onReset={handleReset} />
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit(onSubmit)}
                      noValidate
                      className="space-y-4"
                    >
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                          Ваше имя <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register('name')}
                          type="text"
                          placeholder="Иван Иванов"
                          autoComplete="name"
                          className={`input-field text-neutral-dark ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                          Телефон <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register('phone')}
                          type="tel"
                          placeholder="+7 (999) 999-99-99"
                          autoComplete="tel"
                          className={`input-field text-neutral-dark ${errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* Email (optional) */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                          Email <span className="text-neutral-medium text-xs font-normal">(необязательно)</span>
                        </label>
                        <input
                          {...register('email')}
                          type="email"
                          placeholder="ivan@example.com"
                          autoComplete="email"
                          className={`input-field text-neutral-dark ${errors.email ? 'border-red-400' : ''}`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Project select */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                          Интересующий проект
                        </label>
                        <div className="relative">
                          <select
                            {...register('project')}
                            className="input-field text-neutral-dark appearance-none pr-9 cursor-pointer"
                          >
                            {PROJECT_OPTIONS.map(({ value, label }) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-medium pointer-events-none"
                          />
                        </div>
                      </div>

                      {/* Message (optional) */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                          Сообщение <span className="text-neutral-medium text-xs font-normal">(необязательно)</span>
                        </label>
                        <textarea
                          {...register('message')}
                          rows={3}
                          placeholder="Расскажите о вашем участке, пожеланиях или задайте вопрос..."
                          className="input-field text-neutral-dark resize-none"
                        />
                      </div>

                      {/* Consent */}
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          {...register('consent')}
                          type="checkbox"
                          className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0"
                        />
                        <span className="text-xs text-neutral-medium leading-snug group-hover:text-neutral-dark transition-colors">
                          Я согласен(а) на{' '}
                          <Link
                            href="/privacy"
                            className="text-primary hover:underline"
                            target="_blank"
                          >
                            обработку персональных данных
                          </Link>{' '}
                          в соответствии с ФЗ-152
                        </span>
                      </label>
                      {errors.consent && (
                        <p className="text-red-500 text-xs -mt-2">{errors.consent.message}</p>
                      )}

                      {/* Server error */}
                      {serverError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                          {serverError}
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Отправка...
                          </>
                        ) : (
                          <>
                            <Phone size={16} />
                            Получить расчёт бесплатно
                          </>
                        )}
                      </button>

                      <p className="text-xs text-neutral-medium text-center">
                        Мы не передаём ваши данные третьим лицам
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
