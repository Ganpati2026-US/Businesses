import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

if (!(global as any).redis) {
    const client = new IORedis(redisUrl, {
        maxRetriesPerRequest: null,
        enableOfflineQueue: false, // Prevents command queuing when Redis is down
        lazyConnect: !process.env.REDIS_URL, // Redis is optional in local development
        connectTimeout: 5000,      // Timeout after 5s instead of hanging
    });

    // Attach error listener to prevent process crash
    client.on('error', (err) => {
        if (process.env.REDIS_URL) console.warn('Redis Connection Warning:', err.message || err);
    });

    (global as any).redis = client;
}

const redis = (global as any).redis;

export default redis;
