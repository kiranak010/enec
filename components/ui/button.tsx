import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonSharedProps {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
}

interface ButtonLinkProps extends ButtonSharedProps {
  href: string
  target?: string
  rel?: string
  ariaLabel?: string
}

interface ButtonElementProps extends ButtonSharedProps {
  href?: undefined
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: ComponentPropsWithoutRef<'button'>['onClick']
  ariaLabel?: string
}

export type ButtonProps = ButtonLinkProps | ButtonElementProps

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-cyan-500 text-white shadow-md shadow-cyan-500/25 hover:bg-cyan-600 hover:shadow-cyan-600/25',
  secondary: 'bg-navy-900 text-white hover:bg-navy-800 shadow-md shadow-navy-900/25',
  ghost: 'bg-transparent text-cyan-500 hover:bg-cyan-500/10',
  outline:
    'border border-cyan-500/60 text-cyan-500 hover:bg-cyan-500/10 hover:border-cyan-500',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 disabled:pointer-events-none disabled:opacity-50'

export default function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children } = props
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className)

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes} target={props.target} rel={props.rel}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={props.type ?? 'button'}
      disabled={props.disabled}
      onClick={props.onClick}
      aria-label={props.ariaLabel}
      className={classes}
    >
      {children}
    </button>
  )
}
