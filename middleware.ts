import { NextRequest, NextResponse } from 'next/server';
import { Counter, Histogram } from 'prom-client';

const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'path', 'status'],
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'path'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Không track chính /api/metrics để tránh loop
  if (pathname === '/api/metrics') return;

  const end = httpRequestDuration.startTimer({ method, path: pathname });

  const response = NextResponse.next();

  response.headers.set('X-Started-Metrics', 'true');

  // Sử dụng response callback để lấy status
  response.headers.append('X-Metrics-Path', pathname);

  // Ghi nhận sau khi response xong
  response.headers.append('X-Finalize-Metrics', 'true');

  // Khi response hoàn tất, tăng counter và thời gian
  response.headers.set('on-finished', (() => {
    end(); // đo thời gian
    httpRequestCounter.labels(method, pathname, String(response.status)).inc();
  }) as any);

  return response;
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'], // exclude static assets
};
