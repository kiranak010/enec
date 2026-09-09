'use client'

import { useEffect, useRef, useState } from 'react'
import { Eye } from 'lucide-react'

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null)
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: window.location.pathname }),
        })
        if (!res.ok) return
        const data = (await res.json()) as { total: number }
        if (!cancelled) setCount(data.total)
      } catch {
        // ignore
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const formatted = count === null ? '—' : count.toLocaleString('en-IN')

  return (
    <span className="inline-flex items-center gap-1.5 text-navy-300">
      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
      {formatted} visits
    </span>
  )
}