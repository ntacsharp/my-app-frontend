import { NextRequest, NextResponse } from 'next/server';
import * as Prometheus from 'prom-client';

const requestCounter = new Prometheus.Counter({
  name: 'frontend_requests_total',
  help: 'Total HTTP requests to frontend',
  labelNames: ['path', 'method'],
});

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== '/api/metrics') {
    requestCounter.labels(req.nextUrl.pathname, req.method).inc();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};