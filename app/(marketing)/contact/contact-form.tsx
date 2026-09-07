'use client'

import { useActionState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle2, AlertCircle, Send, Loader2 } from 'lucide-react'
import { submitContact, type ContactFormState } from './actions'

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30'

const labelClass =
  'mb-1.5 block text-sm font-semibold text-navy-900'

const initialState: ContactFormState = { status: 'idle' }

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState
  )

  return (
    <div>
      <form
        action={formAction}
        className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Full name <span className="text-red-600">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Jane Doe"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Email address <span className="text-red-600">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="jane@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contact-phone" className={labelClass}>
              Phone
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contact-company" className={labelClass}>
              Company
            </label>
            <input
              id="contact-company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder="Company name"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="contact-department" className={labelClass}>
            Department <span className="text-red-600">*</span>
          </label>
          <select id="contact-department" name="department" required className={inputClass}>
            <option value="">Select a department…</option>
            <option value="General">General</option>
            <option value="Media">Media</option>
            <option value="Careers">Careers</option>
            <option value="Investors">Investors</option>
            <option value="Suppliers">Suppliers</option>
            <option value="Technical">Technical</option>
          </select>
        </div>

        <div className="mt-5">
          <label htmlFor="contact-subject" className={labelClass}>
            Subject <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            placeholder="How can we help?"
            className={inputClass}
          />
        </div>

        <div className="mt-5">
          <label htmlFor="contact-message" className={labelClass}>
            Message <span className="text-red-600">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={6}
            placeholder="Write your message here…"
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs leading-relaxed text-slate-400">
            By submitting this form you agree to our{' '}
            <a
              href="/privacy"
              className="font-semibold text-cyan-600 underline decoration-cyan-500/40 underline-offset-2 hover:decoration-cyan-500"
            >
              privacy policy
            </a>
            .
          </p>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-all duration-200 hover:bg-cyan-600 disabled:pointer-events-none disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Send Message
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {state.status !== 'idle' ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`mt-6 flex items-start gap-3 rounded-xl border px-5 py-4 text-sm font-medium ${
              state.status === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800'
                : 'border-red-500/30 bg-red-500/10 text-red-800'
            }`}
          >
            {state.status === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <p>{state.message}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}