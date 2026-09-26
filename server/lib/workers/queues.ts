import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

// 1. Define Queues
export const reportQueue = new Queue('reports', { connection });
export const emailQueue = new Queue('emails', { connection });

// 2. Define Workers (These would typically run in a separate process in production)
if (process.env.NODE_ENV !== 'test') {
    new Worker('reports', async (job) => {
        console.log(`Processing report job ${job.id} for restaurant ${job.data.restaurantId}`);
        // Simulate heavy work
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log(`Report completed for ${job.id}`);
    }, { connection });

    new Worker('emails', async (job) => {
        console.log(`Sending email to ${job.data.to}`);
    }, { connection });
}

export const queueEvents = new QueueEvents('reports', { connection });
