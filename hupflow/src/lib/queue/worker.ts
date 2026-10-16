import { Worker, Job } from 'bullmq';
import { redisConnection, SchedulePostJobData } from './scheduler-queue';
import { db } from '../db';
import { posts, postChannels, socialAccounts } from '../db/schema';
import { eq } from 'drizzle-orm';
import { decrypt } from '../connectors/encryption';
import { getSocialConnector } from '../connectors';

export function createSchedulerWorker() {
  const worker = new Worker<SchedulePostJobData>(
    'post-scheduler-queue',
    async (job: Job<SchedulePostJobData>) => {
      const { postId } = job.data;
      console.log(`[Worker] Processando publicação do post: ${postId}`);

      // 1. Atualizar status do post para 'publishing'
      await db.update(posts).set({ status: 'publishing' }).where(eq(posts.id, postId));

      // 2. Buscar o post e canais vinculados
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, postId),
      });

      if (!post) {
        throw new Error(`Post ${postId} não encontrado no banco.`);
      }

      const channels = await db.query.postChannels.findFirst
        ? await db.select().from(postChannels).where(eq(postChannels.postId, postId))
        : [];

      let hasFailures = false;

      // 3. Iterar por cada canal vinculado
      for (const channel of channels) {
        try {
          const account = await db.query.socialAccounts.findFirst({
            where: eq(socialAccounts.id, channel.socialAccountId),
          });

          if (!account) {
            await db
              .update(postChannels)
              .set({ status: 'failed', errorMessage: 'Conta conectada não encontrada' })
              .where(eq(postChannels.id, channel.id));
            hasFailures = true;
            continue;
          }

          const decryptedToken = decrypt(account.encryptedAccessToken);
          const connector = getSocialConnector(account.provider as any);

          const result = await connector.publish(decryptedToken, {
            content: channel.customContent || post.content,
            mediaUrls: [],
          });

          if (result.success) {
            await db
              .update(postChannels)
              .set({
                status: 'published',
                externalPostId: result.externalPostId,
                externalUrl: result.externalPostUrl,
              })
              .where(eq(postChannels.id, channel.id));
          } else {
            hasFailures = true;
            await db
              .update(postChannels)
              .set({
                status: 'failed',
                errorMessage: result.error,
              })
              .where(eq(postChannels.id, channel.id));
          }
        } catch (err: any) {
          hasFailures = true;
          await db
            .update(postChannels)
            .set({
              status: 'failed',
              errorMessage: err?.message || 'Erro durante disparo do canal',
            })
            .where(eq(postChannels.id, channel.id));
        }
      }

      // 4. Conclusão do status geral do post
      await db
        .update(posts)
        .set({
          status: hasFailures ? 'failed' : 'published',
          publishedAt: new Date(),
        })
        .where(eq(posts.id, postId));

      console.log(`[Worker] Concluído processamento do post: ${postId}`);
    },
    {
      connection: redisConnection,
      concurrency: 5,
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} falhou:`, err);
  });

  return worker;
}
