import { Socket } from 'socket.io';
import * as JsonRpc from 'jsonrpc-lite';

export class Response {
    private readonly id: string;
    private socket: Socket;
    private isUsed: boolean;

    public constructor(id: string, socket: Socket) {
        this.id = id;
        this.socket = socket;
        this.isUsed = false;
    }

    public success(payload: any): void {
        this.send(JsonRpc.success(this.id, payload));
    }

    public error(code: number, message: string): void {
        const error = new JsonRpc.JsonRpcError(message, code);
        this.send(JsonRpc.error(this.id, error));
    }

    public notification(room: string, name: string, payload: any): void {
        const notification = JsonRpc.notification(name, payload);
        this.socket.to(room).emit('rpc', JSON.stringify(notification));
    }

    private send(packet: JsonRpc.JsonRpcObject): void {
        if (this.isUsed) {
            throw new Error('Already send response');
        }

        this.socket.emit('rpc', JSON.stringify(packet));
        this.isUsed = true;
    }
}
