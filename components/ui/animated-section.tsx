'use client'

import Reveal from '@/components/ui/reveal'
import type { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function AnimatedSection({
  children,
  className,
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <Reveal className={className} delay={delay}>
      {children}
    </Reveal>
  )
}