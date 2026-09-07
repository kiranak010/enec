import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_NAME = 'enec_session'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get(SESSION_NAME)
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

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js)$).*)',
  ],
}
