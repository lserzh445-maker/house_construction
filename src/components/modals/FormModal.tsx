import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { CallForm, QuoteForm, ConsultationForm, ProjectForm } from '@/components/forms'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type FormType = 'call' | 'quote' | 'consultation' | 'project'

interface FormModalProps {
  isOpen:     boolean
  onClose:    () => void
  formType:   FormType
  projectId?: string
}

/* ─── Config ─────────────────────────────────────────────────────────────── */

const MODAL_CONFIG: Record<FormType, { title: string; subtitle: string }> = {
  call: {
    title:    'Заказать звонок',
    subtitle: 'Мы перезвоним в течение 30 минут',
  },
  quote: {
    title:    'Получить расчёт',
    subtitle: 'Пришлём PDF-смету на вашу почту',
  },
  consultation: {
    title:    'Записаться на консультацию',
    subtitle: 'Бесплатная консультация 30–60 минут',
  },
  project: {
    title:    'Индивидуальный проект',
    subtitle: 'Свяжемся с вами в течение 2 часов',
  },
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function FormModal({ isOpen, onClose, formType, projectId }: FormModalProps) {
  const { title, subtitle } = MODAL_CONFIG[formType]

  const formProps = { onSuccess: onClose }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Panel */}
        <Dialog.Content
          className={[
            // positioning
            'fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            // size: fullscreen on mobile, capped on desktop
            'w-full max-w-[500px]',
            'max-sm:inset-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:left-0 max-sm:top-0 max-sm:rounded-none',
            // appearance
            'bg-white rounded-2xl shadow-2xl overflow-y-auto',
            'max-h-[90dvh] max-sm:max-h-screen',
            // animation
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'duration-200',
          ].join(' ')}
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 p-6 pb-0">
            <div>
              <Dialog.Title className="font-heading font-bold text-xl text-gray-800 leading-tight">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-1">
                {subtitle}
              </Dialog.Description>
            </div>
            <Dialog.Close
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5"
              aria-label="Закрыть"
            >
              <X size={18} />
            </Dialog.Close>
          </div>

          {/* Divider */}
          <div className="mt-4 border-t border-gray-100" />

          {/* Form body */}
          <div className="p-6">
            {formType === 'call' && (
              <CallForm {...formProps} projectId={projectId} />
            )}
            {formType === 'quote' && (
              <QuoteForm {...formProps} projectId={projectId} />
            )}
            {formType === 'consultation' && (
              <ConsultationForm {...formProps} />
            )}
            {formType === 'project' && (
              <ProjectForm {...formProps} />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
