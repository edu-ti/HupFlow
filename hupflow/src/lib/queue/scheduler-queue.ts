import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export interface SchedulePostJobData {
  postId: string;
  organizationId: string;
  channelIds: string[];
}

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Conexão Redis compartilhada com tolerância a falhas em dev
export const redisConnection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 3) return null; // Não trava o processo em ambiente dev sem Redis
    return Math.min(times * 200, 1000);
  },
});

export const postSchedulerQueue = new Queue<SchedulePostJobData>('post-scheduler-queue', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 30000, // 30s inicial
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

/**
 * Enfileira um post para disparo imediato ou com atraso (delayed job)
 */
export async function schedulePostJob(data: SchedulePostJobData, scheduledAt?: Date) {
  let delay = 0;
  if (scheduledAt) {
    const diff = scheduledAt.getTime() - Date.now();
    delay = Math.max(0, diff);
  }

  const jobId = `post_${data.postId}`;

  try {
    return await postSchedulerQueue.add('publish-post', data, {
      delay,
      jobId,
    });
  } catch (error) {
    console.warn('[Scheduler Queue] Redis não conectado ou indisponível. Job não enfileirado:', error);
    return null;
  }
}
