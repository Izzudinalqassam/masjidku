import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // Public routes
    const publicRoutes = ['/login']
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    // Redirect logged-in users away from login page
    if (isLoggedIn && pathname === '/login') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect non-logged-in users to login
    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // Admin-only routes
    const adminRoutes = ['/users', '/settings']
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

    if (isAdminRoute && req.auth?.user?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
