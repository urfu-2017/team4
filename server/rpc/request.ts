import { Socket } from 'socket.io';
import * as JsonRpc from 'jsonrpc-lite';
import { Server } from './server';

export class Request<Params = {}> {
    public params: Readonly<Params>;
    public raw: Readonly<JsonRpc.JsonRpcObject>;
    public server: Server;

    private socket: Socket;

    public get user(): number {
        return this.socket.handshake.query.user;
    }

    public constructor(server: Server, socket: Socket, params: Params, raw: JsonRpc.JsonRpcObject) {
        this.server = server;
        this.socket = socket;
        this.params = params;
        this.raw = raw;
    }
}
