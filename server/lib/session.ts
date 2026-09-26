import { randomBytes } from 'crypto';

/**
 * Generate a unique session ID for anonymous customers
 */
export function generateSessionId(): string {
    return randomBytes(32).toString('hex');
}

/**
 * Get or create session ID from cookies (client-side)
 */
export function getSessionId(): string {
    if (typeof window === 'undefined') return '';

    const sessionKey = 'restaurant_session_id';
    let sessionId = localStorage.getItem(sessionKey);

    if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem(sessionKey, sessionId);
    }

    return sessionId;
}

/**
 * Clear session ID (used when customer leaves)
 */
export function clearSessionId(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('restaurant_session_id');
}
