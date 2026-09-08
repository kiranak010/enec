'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { employeeLogin, type EmployeeLoginState } from './actions'
import { useActionState } from 'react'

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30'

const initialState: EmployeeLoginState = { status: 'idle' }

export default function EmployeeLoginForm({ error }: { error?: string }) {
  const [state, formAction, pending] = useActionState(employeeLogin, initialState)

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="gradient-navy flex flex-1 flex-col px-6 py-12 sm:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-navy-100/80 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to website
        </Link>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center text-center">
              <Image
                src="/images/enec-mark.svg"
                alt="ENEC logo"
                width={72}
                height={39}
                priority
                className="h-14 w-auto"
              />
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">ENEC</h1>
              <p className="mt-2 text-sm text-navy-100/80">Employee Portal</p>
            </div>

            <form
              action={formAction}
              className="mt-10 rounded-2xl border border-white/10 bg-white p-8 shadow-2xl"
            >
              <div>
                <label htmlFor="emp-login-email" className="mb-1.5 block text-sm font-semibold text-navy-900">
                  Work email
                </label>
                <input
                  id="emp-login-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@enec.gov.ae"
                  className={inputClass}
                />
              </div>

              <div className="mt-5">
                <label htmlFor="emp-login-password" className="mb-1.5 block text-sm font-semibold text-navy-900">
                  Password
                </label>
                <input
                  id="emp-login-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              {state.status === 'error' && state.message ? (
                <p
                  role="alert"
                  className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-800"
                >
                  {state.message}
                </p>
              ) : null}

              {error ? (
                <p
                  role="alert"
                  className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-800"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={pending}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-all duration-200 hover:bg-cyan-600 disabled:pointer-events-none disabled:opacity-60"
              >
                {pending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in…
                  </>
                ) : (
                  'Sign in to Portal'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-navy-100/60">
              Authorized ENEC employees only. All activity is logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}