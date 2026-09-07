'use client'

import Button from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-bold text-navy-900 mb-4">404</div>
        <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-slate-600 mb-8">
          The page you are looking for does not exist or has been moved. Please
          check the URL or navigate back to our homepage.
        </p>
        <div className="flex gap-4 justify-center">
          <Button href="/" variant="primary">
            Return Home
          </Button>
          <Button href="/contact" variant="outline">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  )
}