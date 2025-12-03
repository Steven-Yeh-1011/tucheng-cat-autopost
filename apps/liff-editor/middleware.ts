import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 如果已經在特定頁面，不需要重定向
  if (
    pathname === '/dashboard' ||
    pathname.startsWith('/editor') ||
    pathname.startsWith('/drafts') ||
    pathname.startsWith('/generate') ||
    pathname.startsWith('/rich-menu') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact')
  ) {
    return NextResponse.next();
  }
  
  // 檢查是否在 LINE 環境中
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  const url = request.url;
  
  const isInLine = 
    userAgent.includes('Line') ||
    userAgent.includes('LINE') ||
    userAgent.toLowerCase().includes('line') ||
    referer.includes('liff.line.me') ||
    referer.includes('line.me') ||
    url.includes('liff.line.me') ||
    url.includes('line.me') ||
    request.nextUrl.searchParams.has('liff.state');
  
  // 調試日誌（僅在開發環境）
  if (process.env.NODE_ENV === 'development') {
    console.log('[Middleware] Pathname:', pathname);
    console.log('[Middleware] User Agent:', userAgent);
    console.log('[Middleware] Is in LINE:', isInLine);
  }
  
  // 如果在 LINE 環境中且訪問首頁，重定向到 Dashboard
  if (isInLine && pathname === '/') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Redirecting to:', redirectUrl.toString());
    }
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

