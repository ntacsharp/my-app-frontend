// app/api/metrics/route.ts
import { NextResponse } from 'next/server';
import { Counter, collectDefaultMetrics, register } from 'prom-client';

// Chỉ gọi collectDefaultMetrics và tạo counter 1 lần
collectDefaultMetrics();

const requestCounter = new Counter({
  name: 'frontend_requests_total',
  help: 'Total HTTP requests to frontend',
  labelNames: ['path', 'method'],
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    requestCounter.labels(url.pathname, req.method).inc();

    const metrics = await register.metrics();

    // Trả về theo chuẩn Prometheus format
    return new Response(metrics, {
      status: 200,
      headers: {
        'Content-Type': register.contentType,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
