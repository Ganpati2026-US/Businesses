import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import logger from '../lib/logger';

function getAllowedOrigins(): string[] {
    const origins: string[] = [
        process.env.NEXTAUTH_URL,
        process.env.NEXT_PUBLIC_BASE_URL,
        process.env.NEXT_PUBLIC_APP_URL,
    ].filter(Boolean) as string[];

    if (process.env.NODE_ENV !== 'production') {
        origins.push(
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            'http://127.0.0.1:5001'
        );
    }

    return origins;
}

export const initSocket = async (server: NetServer) => {
    const io = new SocketIOServer(server, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
            origin: getAllowedOrigins(),
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // Attach Redis adapter if REDIS_URL is configured for multi-instance support
    if (process.env.REDIS_URL) {
        try {
            const pubClient = createClient({ url: process.env.REDIS_URL });
            const subClient = pubClient.duplicate();
            await Promise.all([pubClient.connect(), subClient.connect()]);
            io.adapter(createAdapter(pubClient, subClient));
            logger.info('Socket.IO using Redis adapter (multi-instance mode)');
        } catch (err) {
            logger.warn({ err }, 'Socket.IO Redis adapter failed to initialise — falling back to in-memory (single-instance)');
        }
    } else {
        logger.info('Socket.IO using in-memory adapter (single-instance mode)');
    }

    io.on('connection', (socket) => {
        logger.debug({ socketId: socket.id }, 'Socket client connected');

        socket.on('join-restaurant', (restaurantId: string) => {
            socket.join(`restaurant-${restaurantId}`);
            logger.debug({ socketId: socket.id, restaurantId }, 'Socket joined restaurant room');
        });

        socket.on('disconnect', () => {
            logger.debug({ socketId: socket.id }, 'Socket client disconnected');
        });
    });

    return io;
};
