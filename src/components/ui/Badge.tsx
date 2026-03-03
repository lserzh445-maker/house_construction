import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:     'bg-primary text-white',
        secondary:   'bg-secondary text-white',
        accent:      'bg-accent text-white',
        outline:     'border-2 border-primary text-primary bg-transparent',
        muted:       'bg-gray-100 text-neutral-dark',
        success:     'bg-green-100 text-green-800',
        warning:     'bg-yellow-100 text-yellow-800',
        destructive: 'bg-red-100 text-red-700',
        ghost:       'bg-white/10 text-white border border-white/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { badgeVariants }
