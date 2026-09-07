'use client'

import { useEffect, useRef, useState } from 'react'

interface StatCounterProps {
  end: number
  suffix?: string
  decimals?: number
  duration?: number
}

export function StatCounter({
  end,
  suffix = '',
  decimals = 0,
  duration = 2000,
}: StatCounterProps) {
  const [displayed, setDisplayed] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const startTime = performance.now()

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayed(eased * end)

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  const formatted = decimals > 0
    ? displayed.toFixed(decimals)
    : Math.floor(displayed).toLocaleString()

  return (
    <div ref={ref} className="tabular-nums">
      {formatted}
      {suffix && <span className="ml-1 text-lg opacity-70">{suffix}</span>}
    </div>
  )
}
