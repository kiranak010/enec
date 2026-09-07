import Image from 'next/image'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
  children?: ReactNode
}

export default function CardImage({
  src,
  alt,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  children,
}: CardImageProps) {
  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  )
}