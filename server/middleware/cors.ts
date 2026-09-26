import { Request, Response, NextFunction } from 'express';

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;
    
    // Define whitelist of allowed origins from environment variables
    const allowedOrigins = [
        process.env.NEXTAUTH_URL,
        process.env.NEXT_PUBLIC_BASE_URL,
        process.env.NEXT_PUBLIC_APP_URL,
    ].filter(Boolean) as string[];

    // Add standard development environments
    if (process.env.NODE_ENV !== 'production') {
        allowedOrigins.push(
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001'
        );
    }

    if (origin) {
        const isAllowed = allowedOrigins.some(
            (allowed) => origin === allowed || origin.startsWith(allowed)
        );

        if (isAllowed) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        } else {
            // Reject unauthorized origins by setting Allow-Origin to a safe default
            res.setHeader('Access-Control-Allow-Origin', 'null');
        }
    } else {
        // Fallback for requests without an Origin header (e.g. standard API calls)
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-tenant-slug');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    next();
}

