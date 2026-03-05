import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Select from '@radix-ui/react-select'
import * as Checkbox from '@radix-ui/react-checkbox'
import useSWR from 'swr'
import { ChevronDown, Check, Loader2, CheckCircle, AlertCircle, Mail, Phone as PhoneIcon } from 'lucide-react'
import { quoteFormSchema, type QuoteFormData, COMPLETION_TYPE_LABELS } from '@/lib/schemas'
import { cn } from '@/utils/cn'
import { formatPhoneInput } from '@/utils/formatPrice'
import type { Project } from '@/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
      <AlertCircle size={13} className="flex-shrink-0" />{message}
    </p>
  )
}

interface QuoteFormProps {
  projectId?: string
  onSuccess?: () => void
  className?: string
}

const COMPLETION_OPTIONS: { value: QuoteFormData['completionType']; label: string; desc: string }[] = [
  { value: 'without_finishing', label: 'Без отделки',  desc: 'Каркас, кровля, окна, двери' },
  { value: 'with_finishing',    label: 'С отделкой',   desc: '+ внутренняя чистовая отделка' },
  { value: 'turnkey',           label: 'Под ключ',     desc: '+ инженерные системы и мебель' },
]

export default function QuoteForm({ projectId, onSuccess, className }: QuoteFormProps) {
  const [status,   setStatus]   = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { data: catalogData } = useSWR<{ data: Project[] }>(
    '/api/catalog?page_size=50',
    fetcher,
    { revalidateOnFocus: false },
  )
  const projects = catalogData?.data ?? []

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name:           '',
      email:          '',
      phone:          '',
      projectId:      projectId ?? '',
      completionType: 'without_finishing',
      consent:        false,
    },
  })

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('phone', formatPhoneInput(e.target.value), { shouldValidate: !!errors.phone })
  }

  const onSubmit = async (data: QuoteFormData) => {
    setErrorMsg(null)
    try {
      const res = await fetch('/api/forms/quote', {
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
        <h3 className="font-heading font-semibold text-lg text-gray-800 mb-2">Заявка принята!</h3>
        <p className="text-gray-500 text-sm mb-1">PDF-расчёт отправлен на вашу почту</p>
        <p className="text-gray-400 text-xs">Также наш менеджер свяжется с вами для уточнения деталей</p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-[#1B5E20] hover:underline">
          Отправить ещё одну заявку
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)} noValidate>

      {/* Name */}
      <div>
        <label htmlFor="qf-name" className="block text-sm font-medium text-gray-700 mb-1">
          Ваше имя <span className="text-red-500">*</span>
        </label>
        <input
          id="qf-name"
          {...register('name')}
          type="text"
          placeholder="Иван Иванов"
          autoComplete="name"
          className={cn('input-field', errors.name && 'border-red-400 focus:ring-red-400')}
        />
        <FieldError message={errors.name?.message} />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="qf-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            id="qf-email"
            {...register('email')}
            type="email"
            placeholder="ivan@example.com"
            autoComplete="email"
            className={cn('input-field pl-9', errors.email && 'border-red-400 focus:ring-red-400')}
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="qf-phone" className="block text-sm font-medium text-gray-700 mb-1">
          Телефон <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <PhoneIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            id="qf-phone"
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

      {/* Project select (required) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Проект <span className="text-red-500">*</span>
        </label>
        <Controller
          control={control}
          name="projectId"
          render={({ field }) => (
            <Select.Root value={field.value} onValueChange={field.onChange}>
              <Select.Trigger
                className={cn(
                  'input-field flex items-center justify-between text-left',
                  !field.value && 'text-gray-400',
                  errors.projectId && 'border-red-400',
                )}
                aria-label="Выберите проект"
              >
                <Select.Value placeholder="Выберите проект">
                  {field.value
                    ? projects.find((p) => p.id === field.value)?.name ?? 'Выберите проект'
                    : 'Выберите проект'}
                </Select.Value>
                <Select.Icon><ChevronDown size={16} className="text-gray-400" /></Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content
                  className="z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                  position="popper" sideOffset={4}
                >
                  <Select.Viewport className="max-h-60 overflow-y-auto p-1">
                    {projects.map((p) => (
                      <Select.Item
                        key={p.id} value={p.id}
                        className="relative flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 rounded-lg cursor-pointer outline-none data-[highlighted]:bg-green-50 data-[state=checked]:text-[#1B5E20] data-[state=checked]:font-medium"
                      >
                        <Select.ItemText>{p.name} ({p.characteristics.area} м²)</Select.ItemText>
                        <Select.ItemIndicator className="ml-auto">
                          <Check size={14} className="text-[#1B5E20]" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          )}
        />
        <FieldError message={errors.projectId?.message} />
      </div>

      {/* Completion type — radio cards */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Комплектация <span className="text-red-500">*</span>
        </p>
        <Controller
          control={control}
          name="completionType"
          render={({ field }) => (
            <div className="space-y-2">
              {COMPLETION_OPTIONS.map(({ value, label, desc }) => (
                <label
                  key={value}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors',
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
                  <div className={cn(
                    'w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                    field.value === value ? 'border-[#1B5E20]' : 'border-gray-300',
                  )}>
                    {field.value === value && (
                      <div className="w-2 h-2 rounded-full bg-[#1B5E20]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        />
        <FieldError message={errors.completionType?.message} />
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
                  field.value ? 'border-[#1B5E20] bg-[#1B5E20]' : errors.consent ? 'border-red-400' : 'border-gray-300 group-hover:border-[#1B5E20]',
                )}
              >
                <Checkbox.Indicator>
                  <Check size={12} className="text-white" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span className="text-sm text-gray-600 leading-snug select-none">
                Согласен(а) на{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#1B5E20] hover:underline" onClick={(e) => e.stopPropagation()}>
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
            <button type="button" onClick={() => setStatus('idle')} className="mt-1 font-medium underline hover:no-underline">
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
          <><Mail size={18} />Получить расчёт на почту</>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">PDF-расчёт придёт на указанный email в течение 15 минут</p>
    </form>
  )
}
