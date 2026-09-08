import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_SESSION = 'enec_session'
const EMPLOYEE_SESSION = 'enec_employee_session'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get(ADMIN_SESSION)
    if (!sessionCookie?.value) {
      const loginUrl = new URL('/admin/login', request.url)
      if (request.nextUrl.search) {
        loginUrl.searchParams.set('next', pathname + request.nextUrl.search)
      } else {
        loginUrl.searchParams.set('next', pathname)
      }
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protect the employee portal (login page stays public).
  if (
    (pathname.startsWith('/portal') && pathname !== '/portal/login') &&
    !pathname.startsWith('/portal/logout')
  ) {
    const sessionCookie = request.cookies.get(EMPLOYEE_SESSION)
    if (!sessionCookie?.value) {
      const loginUrl = new URL('/portal/login', request.url)
      if (request.nextUrl.search) {
        loginUrl.searchParams.set('next', pathname + request.nextUrl.search)
      } else {
        loginUrl.searchParams.set('next', pathname)
      }
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js)$).*)',
  ],
}
