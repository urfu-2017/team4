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
    private sockets: Map<number, io.Socket[]>;

    private readonly sessionStore: Store;
    private readonly methods: Record<string, RpcHandler>;

    public constructor(methods: Record<string, RpcHandler>, sessionStore: Store) {
        this.methods = methods;
        this.sessionStore = sessionStore;
        this.sockets = new Map<number, io.Socket[]>();
    }

    public listen(httpServer: HttpServer): void {
        this.socketServer = io.listen(httpServer, {
            serveClient: true
        });

        this.socketServer.use(this.checkAuth);
        this.socketServer.on('connection', this.onConnection);
    }

    public async subscribeUser(userId: number, channel: string) {
        const sockets = this.sockets.get(userId);

        if (sockets) {
            await Promise.all(
                sockets.map(
                    socket =>
                        new Promise((resolve, reject) => {
                            socket.join(channel, err => {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                resolve();
                            });
                        })
                )
            );
        }
    }

    public unsubscribeUser(userId: number, channel: string) {
        const sockets = this.sockets.get(userId);

        if (sockets) {
            sockets.forEach(socket => socket.leave(channel));
        }
    }

    public isAvailableUser(userId: number) {
        const sockets = this.sockets.get(userId);
        return sockets && sockets.length !== 0;
    }

    public logout(userId: number) {
        const sockets = this.sockets.get(userId);

        if (sockets) {
            sockets.forEach(socket => {
                this.sessionStore.destroy(socket.handshake.query.sid, () => {
                    // ignore
                });
                socket.disconnect(true);
            });
        }
    }

    private onConnection = (socket: io.Socket) => {
        const { user } = socket.handshake.query;
        const clients = this.sockets.get(user);

        if (clients === void 0) {
            this.sockets.set(user, [socket]);
        } else {
            clients.push(socket);
        }

        socket.join(user);
        socket.on('rpc', this.executeRpc.bind(this, socket));
        socket.on('disconnect', this.disconnect.bind(this, socket));
    };

    private disconnect(socket: io.Socket) {
        const { user } = socket.handshake.query;
        let sockets = this.sockets.get(user);

        if (sockets) {
            sockets = sockets.filter(s => s.id !== socket.id);

            if (sockets.length === 0) {
                this.sockets.delete(user);
            } else {
                this.sockets.set(user, sockets);
            }
        }
    }

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

            const request = new Request(this, socket, payload.params, payload);
            const response = new Response(payload.id, socket);

            await method(request, response);
        } catch (error) {
            if (error instanceof JsonRpc.JsonRpcError) {
                socket.emit('rpc', JSON.stringify(error));
            } else {
                socket.emit('rpc', JSON.stringify(JsonRpc.JsonRpcError.internalError(error)));
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
            socket.handshake.query.sid = sid;
            next();
        });
    };
}
