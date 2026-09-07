'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Link2, Linkedin, Twitter } from 'lucide-react'
import { site } from '@/config/site'

interface ShareButtonsProps {
  title: string
  className?: string
}

export default function ShareButtons({ title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
      } else {
        const input = document.createElement('input')
        input.value = window.location.href
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : site.url

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`

  return (
    <div className={className}>
      <span className="block text-sm font-semibold text-slate-500">
        Share this article
      </span>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy link to article"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-cyan-500 hover:text-cyan-600"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="inline-flex items-center gap-2 text-emerald-600"
              >
                <Check className="h-4 w-4" />
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="inline-flex items-center gap-2"
              >
                <Link2 className="h-4 w-4" />
                Copy link
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <motion.a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0A66C2] px-4 py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-lg"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </motion.a>

        <motion.a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#000000] px-4 py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-lg"
        >
          <Twitter className="h-4 w-4" />
          X / Twitter
        </motion.a>
      </div>
    </div>
  )
}