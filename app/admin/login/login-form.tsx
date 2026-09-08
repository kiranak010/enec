'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { login, type LoginState } from './actions'
import { useActionState } from 'react'

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30'

const initialState: LoginState = { status: 'idle' }

export default function LoginForm({ error }: { error?: string }) {
  const [state, formAction, pending] = useActionState(login, initialState)

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
              <p className="mt-2 text-sm text-navy-100/80">Sign in to Admin Dashboard</p>
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
              <a
                href="/api/auth/google"
                className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-navy-900 shadow-sm transition-colors hover:bg-slate-50"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
                  />
                </svg>
                Continue with Google
              </a>

              {!process.env.NEXT_PUBLIC_DISABLE_PASSWORD_LOGIN ? (
                <>
                  <div className="my-6 flex items-center gap-3">
                    <span className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      or
                    </span>
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>

                  <form action={formAction} className="space-y-5">
                    <div>
                      <label
                        htmlFor="login-email"
                        className="mb-1.5 block text-sm font-semibold text-navy-900"
                      >
                        Email address
                      </label>
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@enec.gov.ae"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="login-password"
                        className="mb-1.5 block text-sm font-semibold text-navy-900"
                      >
                        Password
                      </label>
                      <input
                        id="login-password"
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
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-800"
                      >
                        {state.message}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={pending}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-all duration-200 hover:bg-cyan-600 disabled:pointer-events-none disabled:opacity-60"
                    >
                      {pending ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Signing in…
                        </>
                      ) : (
                        'Sign in'
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <p className="mt-6 text-center text-xs text-slate-400">
                  Password login is disabled for this portal.
                </p>
              )}
            </div>

            {error ? (
              <p
                role="alert"
                className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-100"
              >
                {error}
              </p>
            ) : null}

            <p className="mt-8 text-center text-xs text-navy-100/60">
              Authorized personnel only. All activity is logged and audited.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}