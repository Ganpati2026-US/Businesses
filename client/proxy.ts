import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth.edge';

const publicPaths = [
    '/auth/signin',
    '/auth/signup',
    '/api/health',
    '/api/auth',
    '/onboarding',
    '/table/',
    '/icon.svg',
];

function isPublicPath(pathname: string): boolean {
    return publicPaths.some((path) => pathname.startsWith(path));
}

export default auth((req: NextRequest & { auth: any }) => {
    const { nextUrl } = req;
    const pathname = nextUrl.pathname;
    const token = req.auth;
    const isAuthenticated = !!token;

    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    if (pathname === '/') {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
        return NextResponse.next();
    }

    const isDashboard = pathname.startsWith('/dashboard');

    if (isDashboard && !isAuthenticated) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    if (
        isDashboard &&
        isAuthenticated &&
        token?.user?.role !== 'restaurant_owner' &&
        token?.user?.role !== 'system_admin'
    ) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    const hostname = req.headers.get('host') || '';
    const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
    const tenantSlug = !isLocalhost ? hostname.split('.')[0] : req.headers.get('x-tenant-slug');

    const response = NextResponse.next();
    if (tenantSlug) {
        response.headers.set('x-tenant-slug', tenantSlug);
    }

    return response;
});

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)',
    ],
};
