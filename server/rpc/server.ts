import { Server as HttpServer } from 'http';
import * as io from 'socket.io';
import * as JsonRpc from 'jsonrpc-lite';

export class Server {
    private socketServer: io.Server;
    private sockets: Map<string, Record<string, io.Socket>>;
    private methods: Record<string, () => void>;

    public constructor(methods: Record<string, () => void>) {
        this.methods = methods;
        this.sockets = new Map<string, Record<string, io.Socket>>();
    }

    public listen(httpServer: HttpServer): void {
        this.socketServer = io.listen(httpServer, {
            path: '/api',
            serveClient: true
        });

        this.socketServer.use(this.checkAuth);
        this.socketServer.on('connection', this.onConnection);
    }

    private onConnection = (socket: io.Socket) => {
        const { client, username } = socket.handshake.query;
        const clients = this.sockets.get(username);

        if (clients === void 0) {
            this.sockets.set(username, { [client]: socket });
        } else {
            // Запрещаем два и более подключений с одного клиента
            if (clients[client]) {
                clients[client].disconnect(true);
            }

            clients[client] = socket;
        }

        socket.join(username);
        socket.on('rpc', this.executeRpc.bind(this, socket));
    };

    private async executeRpc(socket: io.Socket, rpc: any) {
        try {
            const { payload, type } = JsonRpc.parse(rpc);

            if (type === 'invalid') {
                return;
            }

            socket.emit('rpc', JsonRpc.success(payload.id, payload.method));
        } catch (error) {
            socket.emit('rpc', error);
        }
    }

    private checkAuth = (socket: io.Socket, next: (err?: any) => void) => {
        next();
    }
}
