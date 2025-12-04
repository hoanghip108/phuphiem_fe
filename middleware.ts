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
  // Match both exact path and path with segments for all case variations
  matcher: [
    '/ReturnUrl',
    '/ReturnUrl/:path*',
    '/returnurl',
    '/returnurl/:path*',
    '/RETURNURL',
    '/RETURNURL/:path*',
    '/ReturnURL',
    '/ReturnURL/:path*',
    '/returnUrl',
    '/returnUrl/:path*',
    '/Returnurl',
    '/Returnurl/:path*',
  ],
};


