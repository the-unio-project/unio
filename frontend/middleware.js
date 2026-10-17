import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    const rotasPublicas = ['/login', '/cadastro'];
    const isRotaPublica = rotasPublicas.includes(path);

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
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};