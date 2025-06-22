// middleware.ts
import { NextRequest, NextResponse } from 'next/server';


export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
