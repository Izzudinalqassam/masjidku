import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // Public routes
    const publicRoutes = ['/login', '/']
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/login'))

    // Redirect logged-in users away from login page to admin dashboard
    if (isLoggedIn && pathname === '/login') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    // Redirect non-logged-in users to login, except for public routes
    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // Admin-only routes (Full system admin)
    const adminRoutes = ['/admin/users', '/admin/settings']
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

    if (isAdminRoute && req.auth?.user?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
