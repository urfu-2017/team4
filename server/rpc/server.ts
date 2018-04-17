import { Server as HttpServer } from 'http';
import * as io from 'socket.io';
import * as JsonRpc from 'jsonrpc-lite';
import * as cookie from 'cookie';
import { Store } from 'express-session';
import * as cookieParser from 'cookie-parser';

import { Request } from './request';
import { Response } from './response';
import * as config from '../config';

export type RpcHandler = (req: Request<any>, res: Response) => void;

export class Server {
    private socketServer: io.Server;
    private sockets: Map<string, Record<string, io.Socket>>;

    private readonly sessionStore: Store;
    private readonly methods: Record<string, RpcHandler>;

    public constructor(methods: Record<string, RpcHandler>, sessionStore: Store) {
        this.methods = methods;
        this.sessionStore = sessionStore;
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
        const { client = 'default', user } = socket.handshake.query;
        const clients = this.sockets.get(user);

        if (clients === void 0) {
            this.sockets.set(user, { [client]: socket });
        } else {
            // Запрещаем два и более подключений с одного клиента
            if (clients[client]) {
                clients[client].disconnect(true);
            }

            clients[client] = socket;
        }

        socket.join(user);
        socket.on('rpc', this.executeRpc.bind(this, socket));
    };

    private async executeRpc(socket: io.Socket, rpc: any) {
        try {
            const { payload, type } = JsonRpc.parse(rpc);

            if (type === 'invalid') {
                return;
            }

            const method = this.methods[payload.method];

            if (!method) {
                throw JsonRpc.JsonRpcError.methodNotFound(payload.method);
            }

            const request = new Request(socket, payload.params, payload);
            const response = new Response(payload.id, socket);

            await method(request, response);
        } catch (error) {
            if (error instanceof JsonRpc.JsonRpcError) {
                socket.emit('rpc', error);
            } else {
                socket.emit('rpc', JsonRpc.JsonRpcError.internalError(error));
            }
        }
    }

    private checkAuth = (socket: io.Socket, next: (err?: any) => void) => {
        const cookiesRaw = socket.handshake.headers.cookie || '';
        const cookies = cookie.parse(cookiesRaw);
        const sid = cookieParser.signedCookie(cookies['connect.sid'], config.SECRET_KEY) as string;

        this.sessionStore.get(sid, (err, session) => {
            if (err || !session) {
                next(new Error('authentication error'));
                // Ждём пока пользователю дойдёт сообщение об ошибке
                return setTimeout(() => {
                    socket.disconnect(true);
                }, 300);
            }

            // Прикрепляем идентификатор пользователя к сокету
            socket.handshake.query.user = session.passport.user;
            next();
        });
    };
}
