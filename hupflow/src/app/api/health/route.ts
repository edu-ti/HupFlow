import { NextResponse } from 'next/server';
import { evaluateSystemHealth } from '@/lib/system/service';

export async function GET() {
  const health = evaluateSystemHealth();

  return NextResponse.json(
    {
      status: health.overallStatus,
      version: health.version,
      milestone: health.milestone,
      uptimeSeconds: health.uptimeSeconds,
      timestamp: health.timestamp,
      environment: health.environment,
      featuresCount: health.featuresCount,
      services: {
        database: health.services.database.status,
        cache: health.services.cache.status,
        storage: health.services.storage.status,
        scheduler: health.services.scheduler.status,
      },
      cleanRoomCompliant: true,
    },
    {
      status: health.overallStatus === 'critical' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
