'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (restaurantId?: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!restaurantId) return;

        // Socket.IO runs on the Express backend (EC2), not on Vercel
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

        if (!backendUrl) {
            console.warn('[useSocket] NEXT_PUBLIC_BACKEND_URL not set, skipping socket connection');
            return;
        }

        const socketInstance = io(backendUrl, {
            path: '/api/socket',
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
            timeout: 10000,
        });

        socketInstance.on('connect', () => {
            console.log('[useSocket] Connected to backend socket');
            socketInstance.emit('join-restaurant', restaurantId);
        });

        socketInstance.on('connect_error', (err) => {
            console.warn('[useSocket] Connection error:', err.message);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [restaurantId]);

    return socket;
};
