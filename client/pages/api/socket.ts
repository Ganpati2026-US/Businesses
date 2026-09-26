import { NextApiResponseServerIo } from '@/lib/socket';
import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: any, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        console.log('*First use, starting socket.io');
        const httpServer: NetServer = res.socket.server as any;
        const io = new SocketIOServer(httpServer, {
            path: '/api/socket',
            addTrailingSlash: false,
        });
        res.socket.server.io = io;
    }
    res.end();
};

export default ioHandler;
