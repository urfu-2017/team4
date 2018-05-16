import RPCBuilder from 'jsonrpc-lite/jsonrpc.js';
import io from 'socket.io-client';
import uuid from 'uuid';

import { Methods } from '../../shared/methods';
import { Events } from '../../shared/events';
import { WEB_SOCK_URL } from '../config';

class RPCClient {
    private listeners: Record<string, any[]> = {};
    private pendingRequests = new Map();
    private socket: SocketIOClient.Socket;

    private isExit: boolean = false;

    constructor() {
        this.socket = io.connect(WEB_SOCK_URL, {
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionAttempts: 1,
            autoConnect: false,
            transports: ['websocket', 'polling']
        });
    }

    public connect = () =>
        new Promise((resolve, reject) => {
            if (this.socket.connected) {
                return resolve();
            }

            const connectFailed = reason => {
                this.socket.removeAllListeners();
                this.socket.disconnect();
                reject(new Error('AUTH_ERROR'));
            };

            const connectSuccess = () => {
                this.socket.removeEventListener('error', connectFailed);
                this.socket.addEventListener('connect_error', () => {
                    window.location.reload(true);
                });
                resolve();
            };

            this.socket.once('error', connectFailed);
            this.socket.once('connect', connectSuccess);
            this.socket.once('connect_error', connectFailed);
            this.socket.on('rpc', this.rpcListener);

            this.socket.on('disconnect', (event) => {
                // Если произошёл выход из приложения
                if (this.isExit) {
                    this.isExit = true;
                    window.location.reload(true);
                }
            });

            this.socket.connect();
        });

    public disconnect(isExit: boolean = false) {
        if (isExit) {
            this.isExit = isExit;
            this.request('logout');
        }

        this.socket.disconnect();
    }

    public request = (method: keyof Methods, params?: any, timeout = 15000): Promise<any> =>
        new Promise((resolve, reject) => {
            if (!navigator.onLine) {
                this.socket.disconnect();
                return reject(new Error('Offline'));
            }


            if (!method) {
                return reject(new Error('Missing method name'));
            }

            const payload = RPCBuilder.request(uuid(), method, params);
            this.socket.emit('rpc', JSON.stringify(payload));

            const timer = setTimeout(() => {
                if (this.pendingRequests.has(payload.id)) {
                    this.pendingRequests.delete(payload.id);
                    reject(new Error(`Timeout request: ${method} ${JSON.stringify(params)}`));
                }
            }, timeout);

            this.pendingRequests.set(payload.id, {
                resolve,
                reject,
                timer
            });
        });

    public notification = (name: Events, params) => {
        if (!name) {
            throw new Error('Missing notification name');
        }

        const payload = RPCBuilder.notification(name, params);
        this.socket.emit('rpc', JSON.stringify(payload));
    };

    public addListener = (notificationName: Events, fn) => {
        const listeners = this.listeners[notificationName] || [];
        listeners.push(fn);
        this.listeners[notificationName] = listeners;
    };

    public removeListener = (notificationName: Events, fn) => {
        let listeners = this.listeners[notificationName];

        if (listeners) {
            listeners = listeners.filter(listener => listener !== fn);
        }

        this.listeners[notificationName] = listeners;
    };

    private rpcListener = rpc => {
        const { type, payload } = RPCBuilder.parse(rpc);

        // Не отвечаем на не валидные запросы
        if (type === 'invalid') {
            return;
        }

        if (type === 'notification') {
            const listeners = this.listeners[payload.method];

            if (listeners) {
                listeners.forEach(listener => listener(payload.params));
            }

            return;
        }

        const handler = this.pendingRequests.get(payload.id);

        if (handler) {
            if (type === 'success') {
                handler.resolve(payload.result);
            }

            if (type === 'error') {
                handler.reject(payload.error);
            }

            clearTimeout(handler.timer);
            this.pendingRequests.delete(payload.id);
        }
    };
}

export default new RPCClient();
