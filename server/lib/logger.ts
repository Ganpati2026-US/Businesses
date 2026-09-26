import pino from 'pino';

/**
 * Singleton structured logger for the BitByte server.
 *
 * In development: human-readable pretty output (when pino-pretty is available).
 * In production: fast JSON log lines ready for CloudWatch / Datadog ingestion.
 *
 * Usage:
 *   import logger from '../lib/logger';
 *   logger.info({ orderId }, 'Order created');
 *   logger.error({ err }, 'DB connection failed');
 */
const logger = pino({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    ...(process.env.NODE_ENV !== 'production' && {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:HH:MM:ss',
                ignore: 'pid,hostname',
            },
        },
    }),
});

export default logger;
