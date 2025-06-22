import { NextResponse } from "next/server";
import * as Prometheus from 'prom-client';

// Bật thu thập metrics mặc định
Prometheus.collectDefaultMetrics();

// Tạo custom metric
const requestCounter = new Prometheus.Counter({
  name: 'frontend_requests_total',
  help: 'Total HTTP requests to frontend',
  labelNames: ['path', 'method'],
});

export async function GET(req: Request) {
    try{
        requestCounter.labels(req.url ?? '', req.method).inc();
        const metrics = await Prometheus.register.metrics();
        return NextResponse.json({ metrics: metrics }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}