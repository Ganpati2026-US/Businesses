import 'express';

/**
 * Typed representation of the decoded NextAuth JWT payload
 * attached to authenticated Express requests.
 */
export interface AuthenticatedUser {
    id: string;
    email: string;
    name?: string;
    role?: string;
    restaurantId: string;
    iat?: number;
    exp?: number;
}

declare module 'express' {
    interface Request {
        /**
         * Populated by authMiddleware after successful JWT decode.
         * Only present on authenticated routes.
         */
        user?: AuthenticatedUser;
    }
}
