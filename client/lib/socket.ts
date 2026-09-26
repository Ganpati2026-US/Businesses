import { NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { Socket } from 'net';

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io?: SocketIOServer;
        };
    };
};
