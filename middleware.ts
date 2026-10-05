import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Se for a rota /admin ou sub-rotas (exceto /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Corrigido para 'bletred_session' para coincidir com a API de login
    const session = request.cookies.get('bletred_session');

    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};