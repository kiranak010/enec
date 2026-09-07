'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Factory,
  Users2,
  Briefcase,
  Inbox,
  FileDown,
  Images,
  Leaf,
  MessageSquare,
  UserCog,
  Settings,
  ScrollText,
  Globe,
  Menu,
  X,
  LogOut,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { pretty } from '@/lib/admin'
import { logout } from '@/app/admin/logout/actions'

export interface AdminUser {
  name: string
  email: string
  avatarUrl?: string | null
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Pages', href: '/admin/pages', icon: FileText },
  { label: 'News', href: '/admin/news', icon: Newspaper },
  { label: 'Projects', href: '/admin/projects', icon: Factory },
  { label: 'Leadership', href: '/admin/leadership', icon: Users2 },
  { label: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { label: 'Applications', href: '/admin/applications', icon: Inbox },
  { label: 'Documents', href: '/admin/documents', icon: FileDown },
  { label: 'Media', href: '/admin/media', icon: Images },
  { label: 'Sustainability', href: '/admin/sustainability', icon: Leaf },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Users', href: '/admin/users', icon: UserCog },
  { label: 'Website Editor', href: '/admin/site', icon: Globe },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
]

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/admin/dashboard') return pathname.startsWith('/admin') && pathname === '/admin/dashboard'
  return pathname === href || pathname.startsWith(href + '/')
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Admin" className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
      {navItems.map((item) => {
        const active = isActivePath(pathname, item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-cyan-500/15 text-cyan-300'
                : 'text-navy-100/80 hover:bg-white/5 hover:text-white'
            )}
          >
            <item.icon className={cn('h-4.5 w-4.5 h-[18px] w-[18px] shrink-0', active ? 'text-cyan-400' : 'text-navy-200')} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function Brand() {
  return (
    <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-5 py-5">
      <Image
        src="/images/enec-mark.svg"
        alt="ENEC logo"
        width={36}
        height={20}
        className="h-6 w-auto shrink-0"
      />
      <span className="flex flex-col">
        <span className="text-base font-extrabold leading-none tracking-tight text-white">
          ENEC Admin
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-cyan-400">
          Content Management
        </span>
      </span>
    </Link>
  )
}

function DesktopSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-navy-800 bg-navy-950 lg:flex">
      <Brand />
      <SidebarNav pathname={pathname} />
    </aside>
  )
}

function MobileSidebar({
  open,
  onClose,
  pathname,
}: {
  open: boolean
  onClose: () => void
  pathname: string
}) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-navy-950 shadow-2xl transition-transform duration-300 ease-out lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
      >
        <div className="flex items-center justify-between pr-3">
          <Brand />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarNav pathname={pathname} onNavigate={onClose} />
      </div>
    </>
  )
}

export default function AdminShell({
  user,
  role,
  children,
}: {
  user: AdminUser
  role: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initial = (user.name || 'A').charAt(0).toUpperCase()

  return (
    <div className="flex min-h-screen bg-slate-100">
      <DesktopSidebar pathname={pathname} />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy-900 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="hidden text-sm font-semibold text-slate-400 sm:block">
              ENEC · Content Management System
            </span>
            <span className="text-sm font-semibold text-slate-300 lg:hidden">ENEC Admin</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-700">
              <Shield className="h-3 w-3" />
              {pretty(role)}
            </span>
            <div className="hidden items-center gap-2.5 sm:flex">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-navy-700 text-sm font-bold text-white ring-2 ring-slate-200">
                  {initial}
                </span>
              )}
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-navy-900">{user.name}</span>
                <span className="text-xs text-slate-400">{user.email}</span>
              </div>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>

        <footer className="px-4 pb-6 sm:px-6 lg:px-8">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Emirates Nuclear Energy Corporation · Admin Console
          </p>
        </footer>
      </div>
    </div>
  )
}