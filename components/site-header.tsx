'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, ExternalLink, Menu, Search, X } from 'lucide-react'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'
import { useSite } from '@/lib/i18n/provider'
import type { TKey } from '@/lib/i18n/translations'
import { DEFAULT_NAV } from '@/lib/nav'
import { LanguageSwitcherDropdown, LanguageSwitcherList } from '@/components/language-switcher'

interface NavChild {
  label: string
  href: string
}

interface NavItem {
  key: string
  label: string
  href: string
  children?: NavChild[]
}

function useResolvedNav(): NavItem[] {
  const { t, navOverrides } = useSite()

  return useMemo(() => {
    const items: NavItem[] = []
    for (const item of DEFAULT_NAV) {
      const override = navOverrides[item.key]
      if (override?.hidden) continue

      const children: NavChild[] = []
      if (item.children) {
        for (const child of item.children) {
          const childOverride = override?.children?.[child.key]
          if (childOverride?.hidden) continue
          children.push({
            label: childOverride?.label?.trim() || t(`nav.${child.key}` as TKey),
            href: child.href,
          })
        }
      }

      items.push({
        key: item.key,
        label: override?.label?.trim() || t(`nav.${item.key}` as TKey),
        href: item.href,
        children: children.length > 0 ? children : undefined,
      })
    }
    return items
  }, [t, navOverrides])
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

function DesktopNav({ items }: { items: NavItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary"
      className="hidden items-center gap-0.5 xl:flex"
      onMouseLeave={() => setOpenIndex(null)}
    >
      {items.map((item, index) => {
        const active = isActive(pathname, item.href)
        const isOpen = openIndex === index

        return (
          <div key={item.key} className="relative" onMouseEnter={() => setOpenIndex(index)}>
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                active ? 'text-cyan-500' : 'text-white/85 hover:text-white'
              )}
            >
              {item.label}
              {item.children ? (
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 transition-transform duration-200',
                    isOpen && 'rotate-180'
                  )}
                />
              ) : null}
            </Link>

            {item.children ? (
              <div
                className={cn(
                  'absolute left-0 top-full z-50 w-72 origin-top-left rounded-xl border border-navy-700/50 bg-navy-900/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-lg transition-all duration-200',
                  isOpen
                    ? 'pointer-events-auto translate-y-0 opacity-100'
                    : 'pointer-events-none -translate-y-1 opacity-0'
                )}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block rounded-lg px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-500/10"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        )
      })}
    </nav>
  )
}

function MobileDrawer({
  open,
  onClose,
  items,
}: {
  open: boolean
  onClose: () => void
  items: NavItem[]
}) {
  const { t } = useSite()
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-sm transition-opacity duration-300 xl:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] overflow-y-auto bg-navy-900 shadow-2xl transition-transform duration-300 ease-out xl:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <Image
              src="/images/enec-mark.svg"
              alt="ENEC logo"
              width={40}
              height={22}
              className="h-7 w-auto shrink-0"
            />
            <span className="text-lg font-extrabold tracking-tight text-white">
              {site.shortName}
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.closeMenu')}
            className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav aria-label="Mobile" className="px-4 pb-8">
          {items.map((item) => {
            const hasChildren = Boolean(item.children?.length)
            const isExpanded = expanded === item.key

            return (
              <div key={item.key} className="border-b border-navy-700/50">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex-1 px-3 py-3 text-sm font-semibold text-white/90 hover:text-cyan-500"
                  >
                    {item.label}
                  </Link>
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : item.key)}
                      aria-label={`Toggle ${item.label} submenu`}
                      className="p-3 text-white/70 hover:text-cyan-500"
                    >
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform duration-200',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    </button>
                  ) : null}
                </div>
                {hasChildren ? (
                  <div
                    className={cn(
                      'grid overflow-hidden transition-all duration-300',
                      isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    )}
                  >
                    <div className="min-h-0">
                      <div className="pb-3 pl-4">
                        {item.children?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onClose}
                            className="block px-3 py-2 text-sm text-navy-100 hover:text-cyan-500"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}

          <div className="mt-4">
            <LanguageSwitcherList />
          </div>

          <div className="mt-6 flex flex-col gap-3 px-3">
            <Link
              href="/contact"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
            >
              <ExternalLink className="h-4 w-4" />
              {t('nav.contact')}
            </Link>
            <Link
              href="/admin"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t('common.admin')}
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}

export default function SiteHeader() {
  const { t } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const nav = useResolvedNav()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const onPopState = () => setDrawerOpen(false)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-30 transition-all duration-300',
          scrolled
            ? 'border-b border-navy-700/50 bg-navy-900/90 shadow-lg shadow-black/20 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/images/enec-mark.svg"
              alt="ENEC logo"
              width={48}
              height={26}
              priority
              className="h-8 w-auto shrink-0"
            />
            <span className="flex flex-col">
              <span className="text-xl font-extrabold leading-none tracking-tight text-white">
                {site.shortName}
              </span>
              <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-widest text-cyan-400 sm:block">
                {site.name}
              </span>
            </span>
          </Link>

          <DesktopNav items={nav} />

          <div className="flex items-center gap-1.5">
            <LanguageSwitcherDropdown />

            <Link
              href="/search"
              aria-label={t('common.search')}
              className="rounded-lg p-2 text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </Link>

            <Link
              href="/contact"
              className="hidden rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition-colors hover:bg-cyan-600 sm:inline-flex"
            >
              {t('nav.contact')}
            </Link>

            <Link
              href="/admin"
              className="hidden rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 xl:inline-flex"
            >
              {t('common.admin')}
            </Link>

            <button
              type="button"
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label={drawerOpen ? t('common.closeMenu') : t('common.openMenu')}
              className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 xl:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} items={nav} />
    </>
  )
}