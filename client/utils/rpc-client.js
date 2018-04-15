import io from 'socket.io-client';
import RPCBuilder from 'jsonrpc-lite/jsonrpc.js'; // eslint-disable-line import/extensions
import uuid from 'uuid';
import { WEB_SOCK_URL } from '../config';

class RPCClient {
    /**
     * @private
     */
    listeners = {};

    /**
     * @private
     */
    pendingRequests = new Map();

    constructor() {
        this.socket = io.connect(WEB_SOCK_URL, {
            reconnection: false,
            autoConnect: false,
            transports: ['websocket', 'polling']
        });
    }

    connect = () =>
        new Promise((resolve, reject) => {
            const connectFailed = reason => {
                this.socket.removeAllListeners();
                this.socket.disconnect();
                reject(new Error(reason));
            };

            const connectSuccess = () => {
                this.socket.removeEventListener('error', connectFailed);
                resolve();
            };

            this.socket.once('error', connectFailed);
            this.socket.once('connect', connectSuccess);
            this.socket.once('connect_error', connectFailed);
            this.socket.on('rpc', this.rpcListener);

            this.socket.on('disconnect', () => {
                window.location.reload(true);
            });

            this.socket.connect();
        });

    disconnect() {
        this.socket.disconnect();
    }

    request = (method, params, timeout = 5000) =>
        new Promise((resolve, reject) => {
            if (!method) {
                reject(new Error('Missing method name'));
                return;
            }

            const payload = RPCBuilder.request(uuid(), method, params);
            this.socket.emit('rpc', JSON.stringify(payload));

            const timer = setTimeout(() => {
                if (this.pendingRequests.has(payload.id)) {
                    this.pendingRequests.delete(payload.id);
                    reject(new Error('Timeout request'));
                }
            }, timeout);

            this.pendingRequests.set(payload.id, {
                resolve,
                reject,
                timer
            });
        });

    notification = (name, params) => {
        if (!name) {
            throw new Error('Missing notification name');
        }

        const payload = RPCBuilder.notification(name, params);
        this.socket.emit('rpc', JSON.stringify(payload));
    };

    addListener = (notificationName, fn) => {
        const listeners = this.listeners[notificationName] || [];

        listeners.push(fn);
        this.listeners[notificationName] = listeners;
    };

    removeListener = (notificationName, fn) => {
        let listeners = this.listeners[notificationName];

        if (listeners) {
            listeners = listeners.filter(listener => listener !== fn);
        }

        this.listeners[notificationName] = listeners;
    };

    /**
     * @private
     */
    rpcListener = rpc => {
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
