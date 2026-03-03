import React from 'react'
import { cn } from '@/utils/cn'

/* ─── Card Root ─────────────────────────────────────────────────────── */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ className, hover = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden',
        hover && 'transition-shadow duration-300 hover:shadow-lg',
        className
      )}
      {...props}
    />
  )
}

/* ─── Card Header ───────────────────────────────────────────────────── */
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
  )
}

/* ─── Card Title ────────────────────────────────────────────────────── */
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-heading font-semibold text-lg text-neutral-dark leading-tight', className)}
      {...props}
    />
  )
}

/* ─── Card Description ──────────────────────────────────────────────── */
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-neutral-medium leading-relaxed', className)} {...props} />
  )
}

/* ─── Card Content ──────────────────────────────────────────────────── */
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

/* ─── Card Footer ───────────────────────────────────────────────────── */
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0 gap-3', className)}
      {...props}
    />
  )
}

/* ─── Card Image ────────────────────────────────────────────────────── */
interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: '16/9' | '4/3' | '1/1' | '16/10'
}

export function CardImage({ className, aspectRatio = '16/9', children, ...props }: CardImageProps) {
  const ratioClass = {
    '16/9':  'aspect-video',
    '4/3':   'aspect-[4/3]',
    '1/1':   'aspect-square',
    '16/10': 'aspect-[16/10]',
  }[aspectRatio]

  return (
    <div className={cn('relative overflow-hidden bg-neutral-light', ratioClass, className)} {...props}>
      {children}
    </div>
  )
}
