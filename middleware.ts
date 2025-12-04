import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Redirect any case variation of /ReturnUrl to /returnurl (lowercase) to handle case sensitivity issues
  // This handles /ReturnUrl, /returnurl, /RETURNURL, etc.
  if (pathname.toLowerCase() === '/returnurl' && pathname !== '/returnurl') {
    const url = request.nextUrl.clone();
    url.pathname = '/returnurl';
    // Preserve all query parameters
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Match common case variations - middleware will handle case-insensitive redirect
  // Note: Next.js matcher is case-sensitive, so we list common variations
  matcher: [
    '/ReturnUrl',
    '/returnurl', 
    '/RETURNURL',
    '/ReturnURL',
    '/returnUrl',
    '/Returnurl',
  ],
};


