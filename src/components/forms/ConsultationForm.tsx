import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check, Loader2, CheckCircle, AlertCircle, Phone as PhoneIcon, CalendarClock } from 'lucide-react'
import { consultationFormSchema, type ConsultationFormData } from '@/lib/schemas'
import { cn } from '@/utils/cn'
import { formatPhoneInput } from '@/utils/formatPrice'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
      <AlertCircle size={13} className="flex-shrink-0" />{message}
    </p>
  )
}

/** Returns the minimum selectable datetime (now + 1 hour) in datetime-local format */
function minDateTime(): string {
  const d = new Date(Date.now() + 60 * 60 * 1000)
  return d.toISOString().slice(0, 16)
}

const LOCATION_OPTIONS: { value: ConsultationFormData['location']; label: string; hint: string }[] = [
  { value: 'office',     label: 'В офисе',  hint: 'ул. Строителей, 15' },
  { value: 'exhibition', label: 'Выставка', hint: 'Выставочный комплекс "ДомЭкспо"' },
]

interface ConsultationFormProps {
  onSuccess?: () => void
  className?: string
}

export default function ConsultationForm({ onSuccess, className }: ConsultationFormProps) {
  const [status,    setStatus]    = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg,  setErrorMsg]  = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      name:     '',
      phone:    '',
      email:    '',
      dateTime: '',
      location: 'office',
      topic:    '',
      consent:  false,
    },
  })

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('phone', formatPhoneInput(e.target.value), { shouldValidate: !!errors.phone })
  }

  const onSubmit = async (data: ConsultationFormData) => {
    setErrorMsg(null)
    try {
      const res = await fetch('/api/forms/consultation', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Ошибка сервера')
      }
      setStatus('success')
      reset()
      setCharCount(0)
      onSuccess?.()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Произошла ошибка. Попробуйте позвонить напрямую.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-[#1B5E20]" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-gray-800 mb-2">Консультация забронирована!</h3>
        <p className="text-gray-500 text-sm mb-1">Письмо-подтверждение отправлено на вашу почту</p>
        <p className="text-gray-400 text-xs">Вы получите SMS-напоминание за 1 час до консультации</p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-[#1B5E20] hover:underline">
          Записаться ещё раз
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)} noValidate>

      {/* Name */}
      <div>
        <label htmlFor="cf3-name" className="block text-sm font-medium text-gray-700 mb-1">
          Ваше имя <span className="text-red-500">*</span>
        </label>
        <input
          id="cf3-name"
          {...register('name')}
          type="text"
          placeholder="Иван Иванов"
          autoComplete="name"
          className={cn('input-field', errors.name && 'border-red-400 focus:ring-red-400')}
        />
        <FieldError message={errors.name?.message} />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="cf3-phone" className="block text-sm font-medium text-gray-700 mb-1">
          Телефон <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <PhoneIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            id="cf3-phone"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            autoComplete="tel"
            {...register('phone')}
            onChange={handlePhoneChange}
            className={cn('input-field pl-9', errors.phone && 'border-red-400 focus:ring-red-400')}
          />
        </div>
        <FieldError message={errors.phone?.message} />
      </div>

      {/* Email (optional) */}
      <div>
        <label htmlFor="cf3-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-gray-400 font-normal">(для подтверждения)</span>
        </label>
        <input
          id="cf3-email"
          {...register('email')}
          type="email"
          placeholder="ivan@example.com"
          autoComplete="email"
          className={cn('input-field', errors.email && 'border-red-400 focus:ring-red-400')}
        />
        <FieldError message={errors.email?.message} />
      </div>

      {/* Date & time */}
      <div>
        <label htmlFor="cf3-datetime" className="block text-sm font-medium text-gray-700 mb-1">
          Дата и время <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <CalendarClock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
          <input
            id="cf3-datetime"
            {...register('dateTime')}
            type="datetime-local"
            min={minDateTime()}
            className={cn('input-field pl-9', errors.dateTime && 'border-red-400 focus:ring-red-400')}
          />
        </div>
        <FieldError message={errors.dateTime?.message} />
      </div>

      {/* Location — radio cards */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Место <span className="text-red-500">*</span>
        </p>
        <Controller
          control={control}
          name="location"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2">
              {LOCATION_OPTIONS.map(({ value, label, hint }) => (
                <label
                  key={value}
                  className={cn(
                    'flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-colors',
                    field.value === value
                      ? 'border-[#1B5E20] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300',
                  )}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    value={value}
                    checked={field.value === value}
                    onChange={() => field.onChange(value)}
                  />
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn(
                      'w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                      field.value === value ? 'border-[#1B5E20]' : 'border-gray-300',
                    )}>
                      {field.value === value && (
                        <div className="w-2 h-2 rounded-full bg-[#1B5E20]" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{label}</span>
                  </div>
                  <span className="text-xs text-gray-500 pl-6">{hint}</span>
                </label>
              ))}
            </div>
          )}
        />
        <FieldError message={errors.location?.message} />
      </div>

      {/* Topic (optional textarea) */}
      <div>
        <label htmlFor="cf3-topic" className="block text-sm font-medium text-gray-700 mb-1">
          Тема консультации{' '}
          <span className="text-gray-400 font-normal">(необязательно)</span>
        </label>
        <textarea
          id="cf3-topic"
          {...register('topic', {
            onChange: (e) => setCharCount((e.target as HTMLTextAreaElement).value.length),
          })}
          rows={3}
          placeholder="Опишите ваш вопрос или пожелания"
          maxLength={500}
          className={cn('input-field resize-none', errors.topic && 'border-red-400 focus:ring-red-400')}
        />
        <div className="flex justify-between mt-1">
          <FieldError message={errors.topic?.message} />
          <span className="text-xs text-gray-400 ml-auto">{charCount}/500</span>
        </div>
      </div>

      {/* Consent */}
      <div>
        <Controller
          control={control}
          name="consent"
          render={({ field }) => (
            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox.Root
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
                className={cn(
                  'w-5 h-5 flex-shrink-0 mt-0.5 rounded border-2 flex items-center justify-center transition-colors outline-none',
                  'focus-visible:ring-2 focus-visible:ring-[#1B5E20] focus-visible:ring-offset-1',
                  field.value
                    ? 'border-[#1B5E20] bg-[#1B5E20]'
                    : errors.consent
                    ? 'border-red-400'
                    : 'border-gray-300 group-hover:border-[#1B5E20]',
                )}
              >
                <Checkbox.Indicator>
                  <Check size={12} className="text-white" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span className="text-sm text-gray-600 leading-snug select-none">
                Согласен(а) на{' '}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1B5E20] hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  обработку персональных данных
                </a>
              </span>
            </label>
          )}
        />
        <FieldError message={errors.consent?.message} />
      </div>

      {/* Server error */}
      {status === 'error' && errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <p>{errorMsg}</p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-1 font-medium underline hover:no-underline"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? (
          <><Loader2 size={18} className="animate-spin" />Отправка...</>
        ) : (
          <><CalendarClock size={18} />Записаться на консультацию</>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Консультация бесплатная, длительность 30–60 минут
      </p>
    </form>
  )
}
