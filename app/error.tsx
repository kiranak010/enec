'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">
          Something Went Wrong
        </h1>
        <p className="text-slate-600 mb-8">
          An unexpected error occurred. Our team has been notified. Please try
          again or contact support if the issue persists.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <Button href="/" variant="outline">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  )
}