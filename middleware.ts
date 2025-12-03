import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect /ReturnUrl to /returnurl (lowercase) to handle case sensitivity issues
  if (request.nextUrl.pathname === '/ReturnUrl') {
    const url = request.nextUrl.clone();
    url.pathname = '/returnurl';
    // Preserve all query parameters
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/ReturnUrl',
};

