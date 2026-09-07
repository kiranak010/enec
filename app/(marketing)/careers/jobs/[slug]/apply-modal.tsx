'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Copy, X, Briefcase, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/button'

interface ApplyModalProps {
  jobTitle: string
  department: string
  location: string
}

export default function ApplyModal({ jobTitle, department, location }: ApplyModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2200)
      })
    }
  }

  const mailtoLink = `mailto:careers@enec.gov.ae?subject=${encodeURIComponent(
    `Application: ${jobTitle}`
  )}&body=${encodeURIComponent(
    `Hello,\n\nI am interested in the following position and would like to submit my application:\n\nPosition: ${jobTitle}\nDepartment: ${department}\nLocation: ${location}\n\nPlease find my CV and any other required documents attached.\n\nKind regards,`
  )}`

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          href={mailtoLink}
          size="lg"
          className="flex-1 sm:flex-none"
          target="_blank"
        >
          Apply Now
          <ArrowRight className="h-5 w-5" />
        </Button>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Apply for this position"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-cyan-500 hover:text-cyan-600"
        >
          <Briefcase className="h-4 w-4" />
          Online Application
        </button>

        <button
          type="button"
          onClick={shareLink}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-cyan-500 hover:text-cyan-600"
          aria-label="Copy link to share this position"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="inline-flex items-center gap-2 text-emerald-600"
              >
                <Check className="h-4 w-4" />
                Link copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="inline-flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Share
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <h3 className="text-lg font-bold text-navy-900">
                  Apply for {jobTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 px-6 py-6">
                <p className="text-sm leading-relaxed text-slate-600">
                  Submit your application by emailing{' '}
                  <a
                    href={mailtoLink}
                    className="font-semibold text-cyan-600 underline decoration-cyan-500/40 underline-offset-2 hover:decoration-cyan-500"
                    target="_blank"
                  >
                    careers@enec.gov.ae
                  </a>{' '}
                  with your CV and a short cover letter referencing this role.
                </p>

                <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-600">
                  <p className="mb-3 font-semibold text-navy-900">
                    Please include in your application:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                      Your latest CV / resume
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                      A cover letter explaining your interest
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                      Examples of relevant work or publications (optional)
                    </li>
                  </ul>
                </div>

                <p className="text-xs leading-relaxed text-slate-400">
                  We are an equal opportunities employer and welcome
                  applications from all qualified candidates regardless of
                  race, gender, disability, religion or sexual orientation.
                </p>
              </div>

              <div className="border-t border-slate-200 px-6 py-5">
                <Button
                  href={mailtoLink}
                  className="w-full"
                  size="lg"
                  target="_blank"
                >
                  Open Email Client
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}