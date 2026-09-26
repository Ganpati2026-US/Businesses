import { Request, Response, NextFunction } from 'express';
import { decode } from 'next-auth/jwt';
import type { AuthenticatedUser } from '../types/express';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const cookies = req.headers.cookie || '';
        
        // Match either next-auth.session-token or authjs.session-token (including __Secure- prefix)
        const tokenMatch = cookies.match(/(?:^|;)\s*(__Secure-)?(next-auth|authjs)\.session-token=([^;]+)/);
        let token = tokenMatch ? decodeURIComponent(tokenMatch[3]) : null;

        // Fallback to Authorization header if provided
        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No session token found' });
        }

        const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
        if (!secret) {
            console.error('Missing AUTH_SECRET or NEXTAUTH_SECRET environment variable');
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const cookieName = tokenMatch 
            ? `${tokenMatch[1] || ''}${tokenMatch[2]}.session-token` 
            : (process.env.NODE_ENV === 'production' 
                ? '__Secure-next-auth.session-token' 
                : 'next-auth.session-token');

        const decoded = await decode({
            token,
            secret,
            salt: cookieName,
        });

        if (!decoded || !decoded.restaurantId) {
            return res.status(401).json({ error: 'Unauthorized: Invalid session' });
        }

        // Attach typed user context to request
        req.user = decoded as unknown as AuthenticatedUser;
        if ((req as any).session) {
            (req as any).session.user = req.user;
        }

        next();
    } catch (error) {
        console.error('Express authentication error:', error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
