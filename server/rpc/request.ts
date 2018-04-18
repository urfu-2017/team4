import { Socket } from 'socket.io';
import * as JsonRpc from 'jsonrpc-lite';

export class Request<Params = {}> {
    public params: Readonly<Params>;
    public raw: Readonly<JsonRpc.JsonRpcObject>;
    private socket: Socket;

    public get user(): string {
        return this.socket.handshake.query.user;
    }

    public constructor(socket: Socket, params: Params, raw: JsonRpc.JsonRpcObject) {
        this.socket = socket;
        this.params = params;
        this.raw = raw;
    }
}
