/**
 * Next.js Instrumentation Hook
 * Runs once when the server starts up, before any request handling.
 * Used here to fix macOS DNS resolution for MongoDB Atlas SRV records.
 */
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        try {
            const dns = await import('dns');
            dns.setServers(['8.8.8.8', '1.1.1.1']);
            console.log('[instrumentation] DNS servers set to public resolvers for MongoDB Atlas SRV resolution.');
        } catch (e) {
            // ignore — dns module not available
        }
    }
}
