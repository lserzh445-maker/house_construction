import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { contactsApi } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Введите имя (минимум 2 символа)'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  project: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Необходимо дать согласие' }),
  }),
})

type FormData = z.infer<typeof schema>

interface CallFormProps {
  projectName?: string
  onSuccess?: () => void
  className?: string
}

export default function CallForm({ projectName, onSuccess, className }: CallFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { project: projectName, consent: undefined },
  })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      await contactsApi.submitCall(data)
      setSubmitted(true)
      reset()
      onSuccess?.()
    } catch {
      setServerError('Произошла ошибка. Попробуйте позвонить напрямую.')
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-primary text-3xl">✓</span>
        </div>
        <h3 className="text-xl font-semibold font-heading mb-2">Заявка принята!</h3>
        <p className="text-neutral-medium">Мы позвоним вам в течение 30 минут</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 ${className ?? ''}`} noValidate>
      <div>
        <input
          {...register('name')}
          type="text"
          placeholder="Ваше имя *"
          autoComplete="name"
          className="input-field"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <input
          {...register('phone')}
          type="tel"
          placeholder="+7 (___) ___-__-__ *"
          autoComplete="tel"
          className="input-field"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      {projectName && (
        <input type="hidden" {...register('project')} />
      )}

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          {...register('consent')}
          type="checkbox"
          className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0"
        />
        <span className="text-sm text-neutral-medium leading-snug">
          Согласен на{' '}
          <a href="/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            обработку персональных данных
          </a>
        </span>
      </label>
      {errors.consent && (
        <p className="text-red-500 text-sm -mt-2">{errors.consent.message}</p>
      )}

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? 'Отправка...' : 'Заказать звонок'}
      </button>

      <p className="text-xs text-neutral-medium text-center">
        Мы позвоним вам в течение 30 минут в рабочее время
      </p>
    </form>
  )
}
