import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (token && req.nextUrl.pathname.startsWith('/account')) {
        return NextResponse.redirect(new URL('/home', req.url))
    }
    if (!token && req.nextUrl.pathname.startsWith('/profile')) {
        return NextResponse.redirect(new URL('/home', req.url))
    }
    if (req.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin`))
    }
    // if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    //     return NextResponse.redirect(new URL('/home', req.url));
    // }
    return NextResponse.next()
}

export const config = {
    matcher: ['/:path*']
}