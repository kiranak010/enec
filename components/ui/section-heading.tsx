import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
  className?: string
}

export default function SectionHeading({
  title,
  subtitle,
  centered = false,
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-12 max-w-2xl',
        centered && 'mx-auto text-center',
        className
      )}
    >
      <h2
        className={cn(
          'line-accent text-3xl font-bold tracking-tight sm:text-4xl',
          centered && 'mx-auto',
          light ? 'text-white' : 'text-navy-900'
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            'mt-5 text-lg leading-relaxed',
            light ? 'text-navy-100/80' : 'text-slate-600'
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
