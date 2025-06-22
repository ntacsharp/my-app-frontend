import { NextApiRequest, NextApiResponse } from 'next';
import * as Prometheus from 'prom-client';

// Bật thu thập metrics mặc định
Prometheus.collectDefaultMetrics();

// Tạo custom metric
const requestCounter = new Prometheus.Counter({
  name: 'frontend_requests_total',
  help: 'Total HTTP requests to frontend',
  labelNames: ['path', 'method'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    requestCounter.labels(req.url ?? '', req.method).inc();
    res.setHeader('Content-Type', Prometheus.register.contentType);
    res.status(200).send(await Prometheus.register.metrics());
  } else {
    res.status(405).end();
  }
}