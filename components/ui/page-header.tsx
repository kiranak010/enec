'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  image: string
  children?: ReactNode
  className?: string
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  image,
  children,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        'relative flex min-h-[420px] items-center overflow-hidden md:min-h-[460px]',
        className
      )}
    >
      <div className="absolute inset-0">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-navy-hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-navy-950/30" />
      </div>

      <div className="container-narrow relative z-10 px-4 py-24 sm:px-6 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {eyebrow ? (
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <div className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-100/85">
              {description}
            </div>
          ) : null}
        </motion.div>

        {children ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}