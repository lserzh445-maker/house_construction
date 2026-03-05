import React, { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Checkbox from '@radix-ui/react-checkbox'
import {
  Check, Loader2, CheckCircle, AlertCircle,
  Phone as PhoneIcon, Paperclip, X as XIcon, FileText,
} from 'lucide-react'
import { projectFormSchema, type ProjectFormData } from '@/lib/schemas'
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

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf', 'dwg']
const MAX_SIZE_MB = 10

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

interface ProjectFormProps {
  onSuccess?: () => void
  className?: string
}

export default function ProjectForm({ onSuccess, className }: ProjectFormProps) {
  const [status,    setStatus]    = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg,  setErrorMsg]  = useState<string | null>(null)
  const [fileList,  setFileList]  = useState<File[]>([])
  const [reqCount,  setReqCount]  = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name:         '',
      phone:        '',
      email:        '',
      desiredArea:  undefined,
      bedrooms:     undefined,
      requirements: '',
      consent:      false,
    },
  })

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('phone', formatPhoneInput(e.target.value), { shouldValidate: !!errors.phone })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? [])
    const merged   = [...fileList, ...incoming]

    // Validate extensions
    const invalid = merged.filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
      return !ALLOWED_EXTENSIONS.includes(ext)
    })
    if (invalid.length > 0) {
      alert(`Недопустимый формат: ${invalid.map((f) => f.name).join(', ')}.\nДопустимы: ${ALLOWED_EXTENSIONS.join(', ').toUpperCase()}`)
      e.target.value = ''
      return
    }

    // Validate total size
    const totalBytes = merged.reduce((s, f) => s + f.size, 0)
    if (totalBytes > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Общий размер файлов превышает ${MAX_SIZE_MB} МБ`)
      e.target.value = ''
      return
    }

    setFileList(merged)
    // Build a DataTransfer to give back a FileList to RHF
    const dt = new DataTransfer()
    merged.forEach((f) => dt.items.add(f))
    setValue('files', dt.files, { shouldValidate: true })
    e.target.value = ''
  }

  const removeFile = (idx: number) => {
    const updated = fileList.filter((_, i) => i !== idx)
    setFileList(updated)
    if (updated.length === 0) {
      setValue('files', undefined)
    } else {
      const dt = new DataTransfer()
      updated.forEach((f) => dt.items.add(f))
      setValue('files', dt.files)
    }
  }

  const onSubmit = async (data: ProjectFormData) => {
    setErrorMsg(null)
    try {
      // Send as JSON (file names only); real S3 upload handled separately
      const payload = {
        name:         data.name,
        phone:        data.phone,
        email:        data.email,
        desiredArea:  data.desiredArea,
        bedrooms:     data.bedrooms,
        requirements: data.requirements,
        fileNames:    fileList.map((f) => f.name),
      }
      const res = await fetch('/api/forms/project', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Ошибка сервера')
      }
      setStatus('success')
      reset()
      setFileList([])
      setReqCount(0)
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
        <h3 className="font-heading font-semibold text-lg text-gray-800 mb-2">Заявка отправлена!</h3>
        <p className="text-gray-500 text-sm mb-1">Мы свяжемся с вами в течение 2 часов</p>
        <p className="text-gray-400 text-xs">Наш лучший архитектор уже назначен на вашу заявку</p>
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
        <label htmlFor="pf-name" className="block text-sm font-medium text-gray-700 mb-1">
          Ваше имя <span className="text-red-500">*</span>
        </label>
        <input
          id="pf-name"
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
        <label htmlFor="pf-phone" className="block text-sm font-medium text-gray-700 mb-1">
          Телефон <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <PhoneIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            id="pf-phone"
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

      {/* Email */}
      <div>
        <label htmlFor="pf-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="pf-email"
          {...register('email')}
          type="email"
          placeholder="ivan@example.com"
          autoComplete="email"
          className={cn('input-field', errors.email && 'border-red-400 focus:ring-red-400')}
        />
        <FieldError message={errors.email?.message} />
      </div>

      {/* Area + Bedrooms — side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="pf-area" className="block text-sm font-medium text-gray-700 mb-1">
            Площадь, м² <span className="text-gray-400 font-normal">(~)</span>
          </label>
          <input
            id="pf-area"
            {...register('desiredArea', { valueAsNumber: true })}
            type="number"
            placeholder="85"
            min={30}
            max={500}
            className={cn('input-field', errors.desiredArea && 'border-red-400 focus:ring-red-400')}
          />
          <FieldError message={errors.desiredArea?.message} />
        </div>
        <div>
          <label htmlFor="pf-rooms" className="block text-sm font-medium text-gray-700 mb-1">
            Комнат <span className="text-gray-400 font-normal">(~)</span>
          </label>
          <input
            id="pf-rooms"
            {...register('bedrooms', { valueAsNumber: true })}
            type="number"
            placeholder="3"
            min={1}
            max={10}
            className={cn('input-field', errors.bedrooms && 'border-red-400 focus:ring-red-400')}
          />
          <FieldError message={errors.bedrooms?.message} />
        </div>
      </div>

      {/* Requirements */}
      <div>
        <label htmlFor="pf-req" className="block text-sm font-medium text-gray-700 mb-1">
          Дополнительные требования{' '}
          <span className="text-gray-400 font-normal">(необязательно)</span>
        </label>
        <textarea
          id="pf-req"
          {...register('requirements', {
            onChange: (e) => setReqCount((e.target as HTMLTextAreaElement).value.length),
          })}
          rows={4}
          placeholder="Опишите пожелания: стиль, материалы, этажность, особые требования..."
          maxLength={1000}
          className={cn('input-field resize-none', errors.requirements && 'border-red-400 focus:ring-red-400')}
        />
        <div className="flex justify-between mt-1">
          <FieldError message={errors.requirements?.message} />
          <span className="text-xs text-gray-400 ml-auto">{reqCount}/1000</span>
        </div>
      </div>

      {/* File upload */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          Эскизы или планы{' '}
          <span className="text-gray-400 font-normal">(необязательно)</span>
        </p>

        {/* Drop zone / trigger */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-[#1B5E20] transition-colors text-center group"
        >
          <Paperclip size={20} className="mx-auto mb-2 text-gray-400 group-hover:text-[#1B5E20] transition-colors" />
          <p className="text-sm text-gray-500 group-hover:text-[#1B5E20] transition-colors">
            Нажмите для загрузки файла
          </p>
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG, PDF, DWG · не более {MAX_SIZE_MB} МБ суммарно
          </p>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.dwg"
          className="hidden"
          onChange={handleFileChange}
        />
        <FieldError message={errors.files?.message as string | undefined} />

        {/* File list */}
        {fileList.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {fileList.map((file, idx) => (
              <li key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <FileText size={14} className="text-[#1B5E20] flex-shrink-0" />
                <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">{formatFileSize(file.size)}</span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-500 transition-colors flex-shrink-0"
                  aria-label={`Удалить ${file.name}`}
                >
                  <XIcon size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}
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
          'Отправить заявку на индивидуальный проект'
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Первичный контакт нашего архитектора — в течение 2 часов в рабочее время
      </p>
    </form>
  )
}
