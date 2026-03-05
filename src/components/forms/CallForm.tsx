import React, { useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Select from '@radix-ui/react-select'
import * as Checkbox from '@radix-ui/react-checkbox'
import useSWR from 'swr'
import { ChevronDown, Check, Loader2, CheckCircle, AlertCircle, Phone } from 'lucide-react'
import { callFormSchema, type CallFormData } from '@/lib/schemas'
import { cn } from '@/utils/cn'
import { formatPhoneInput } from '@/utils/formatPrice'
import type { Project } from '@/types'

/* ─── SWR fetcher ────────────────────────────────────────────────────────── */

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={13} />{message}</p>
}

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface CallFormProps {
  /** Pre-select this project in the dropdown by project ID */
  projectId?: string
  /** Called after successful submission */
  onSuccess?: () => void
  className?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function CallForm({ projectId, onSuccess, className }: CallFormProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Load projects for the select dropdown
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
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CallFormData>({
    resolver: zodResolver(callFormSchema),
    defaultValues: {
      name:      '',
      phone:     '',
      projectId: projectId ?? '',
      consent:   false,
    },
  })

  // Phone change handler with live formatting
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneInput(e.target.value)
      setValue('phone', formatted, { shouldValidate: errors.phone !== undefined })
    },
    [setValue, errors.phone],
  )

  const onSubmit = async (data: CallFormData) => {
    setErrorMsg(null)
    try {
      const res = await fetch('/api/forms/call', {
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

  /* ── Success state ── */
  if (status === 'success') {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-[#1B5E20]" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-gray-800 mb-2">Заявка принята!</h3>
        <p className="text-gray-500 text-sm">Мы позвоним вам в течение 30 минут в рабочее время</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-[#1B5E20] hover:underline"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-4', className)}
      noValidate
    >
      {/* ── Name ── */}
      <div>
        <label htmlFor="cf-name" className="block text-sm font-medium text-gray-700 mb-1">
          Ваше имя <span className="text-red-500">*</span>
        </label>
        <input
          id="cf-name"
          {...register('name')}
          type="text"
          placeholder="Иван Иванов"
          autoComplete="name"
          className={cn('input-field', errors.name && 'border-red-400 focus:ring-red-400')}
        />
        <FieldError message={errors.name?.message} />
      </div>

      {/* ── Phone ── */}
      <div>
        <label htmlFor="cf-phone" className="block text-sm font-medium text-gray-700 mb-1">
          Номер телефона <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            id="cf-phone"
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

      {/* ── Project select ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Проект <span className="text-gray-400 font-normal">(необязательно)</span>
        </label>
        <Controller
          control={control}
          name="projectId"
          render={({ field }) => (
            <Select.Root
              value={field.value ?? ''}
              onValueChange={(val) => field.onChange(val === '__none__' ? '' : val)}
            >
              <Select.Trigger
                className={cn(
                  'input-field flex items-center justify-between text-left',
                  !field.value && 'text-gray-400',
                )}
                aria-label="Выберите проект"
              >
                <Select.Value placeholder="Выберите проект">
                  {field.value
                    ? projects.find((p) => p.id === field.value)?.name ?? 'Выберите проект'
                    : 'Выберите проект'}
                </Select.Value>
                <Select.Icon>
                  <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                </Select.Icon>
              </Select.Trigger>

              <Select.Portal>
                <Select.Content
                  className="z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95"
                  position="popper"
                  sideOffset={4}
                >
                  <Select.Viewport className="max-h-60 overflow-y-auto p-1">
                    <Select.Item
                      value="__none__"
                      className="relative flex items-center gap-2 px-3 py-2.5 text-sm text-gray-500 rounded-lg cursor-pointer hover:bg-gray-50 outline-none data-[highlighted]:bg-gray-50"
                    >
                      <Select.ItemText>Выберите проект</Select.ItemText>
                    </Select.Item>

                    {projects.map((p) => (
                      <Select.Item
                        key={p.id}
                        value={p.id}
                        className="relative flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-green-50 outline-none data-[highlighted]:bg-green-50 data-[state=checked]:text-[#1B5E20] data-[state=checked]:font-medium"
                      >
                        <Select.ItemText>
                          {p.name} ({p.characteristics.area} м²)
                        </Select.ItemText>
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

      {/* ── Consent ── */}
      <div>
        <Controller
          control={control}
          name="consent"
          render={({ field }) => (
            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox.Root
                id="cf-consent"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                className={cn(
                  'w-5 h-5 flex-shrink-0 mt-0.5 rounded border-2 flex items-center justify-center',
                  'transition-colors duration-150 outline-none',
                  'focus-visible:ring-2 focus-visible:ring-[#1B5E20] focus-visible:ring-offset-1',
                  field.value
                    ? 'border-[#1B5E20] bg-[#1B5E20]'
                    : errors.consent
                    ? 'border-red-400'
                    : 'border-gray-300 group-hover:border-[#1B5E20]',
                )}
                aria-label="Согласие на обработку персональных данных"
              >
                <Checkbox.Indicator>
                  <Check size={12} className="text-white" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span className="text-sm text-gray-600 leading-snug select-none">
                Я согласен(а) на{' '}
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

      {/* ── Server error ── */}
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

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Отправка...
          </>
        ) : (
          <>
            <Phone size={18} />
            Заказать звонок
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Мы позвоним в течение 30 минут в рабочее время (Пн–Пт 9:00–18:00)
      </p>
    </form>
  )
}
