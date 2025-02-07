// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    console.log('🔵 Middleware - Checking route:', request.nextUrl.pathname);

    // Get token
    const token = request.cookies.get('token')?.value;
    console.log('🔵 Middleware - Token present:', !!token);

    // For dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        console.log('🔵 Middleware - Checking dashboard access');

        if (!token) {
            console.log('🔴 Middleware - No token, redirecting to login');
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        // Instead of verifying the token here, we'll let the API route handle verification
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*']
};