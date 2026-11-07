import { NextResponse } from 'next/server';

const BACKEND_URL =
    process.env.BACKEND_URL ?? 'https://unio-production-4e4a.up.railway.app';

export function proxy(request) {
    const { pathname, search } = request.nextUrl;

    if (pathname.startsWith('/api-proxy/')) {
        const caminhoApi = pathname.replace('/api-proxy', '');
        return NextResponse.rewrite(new URL(`${BACKEND_URL}${caminhoApi}${search}`));
    }

    const rotasPublicas = ['/login', '/cadastro'];
    const isRotaPublica = rotasPublicas.includes(pathname);

    const token = request.cookies.get('access_token')?.value;

    if (!isRotaPublica && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isRotaPublica && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api-proxy/:path*', '/((?!api|_next/static|_next/image|favicon.svg|.*\\..*).*)'],
};