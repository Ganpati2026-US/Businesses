import pinoHttp from 'pino-http';
import logger from '../lib/logger';

/**
 * HTTP request logger middleware using pino-http.
 *
 * Logs every request with:
 *  - method, url, status code, response time
 *  - A unique request ID (auto-generated UUID) for correlation
 *  - The req/res are also available in every log line via the request context
 *
 * Skips logging for health check endpoint to keep logs clean.
 */
export const requestLogger = pinoHttp({
    logger,
    // Assign a unique ID to each request for log correlation
    genReqId: (req) => {
        const existingId = req.headers['x-request-id'];
        if (existingId) return existingId as string;
        return crypto.randomUUID();
    },
    // Attach the request ID back to the response header for tracing
    customSuccessMessage: (req, res) =>
        `${req.method} ${req.url} → ${res.statusCode}`,
    customErrorMessage: (req, res, err) =>
        `${req.method} ${req.url} → ${res.statusCode} [${err.message}]`,
    // Skip health checks to avoid log noise
    autoLogging: {
        ignore: (req) => req.url === '/api/health',
    },
    // Customize serializers to limit data exposure
    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            remoteAddress: req.remoteAddress,
        }),
        res: (res) => ({
            statusCode: res.statusCode,
        }),
    },
});
