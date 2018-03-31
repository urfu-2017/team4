import io from 'socket.io-client';
// eslint-disable-next-line import/extensions
import RPCBuilder from 'jsonrpc-lite';
import uuid from 'uuid4';

const pendingRequests = new Map();

const socket = io.connect('http://localhost:8080', {
    reconnection: true,
    autoConnect: false
});

export const connect = () => new Promise((resolve, reject) => {
    const connectFailed = (reason) => {
        socket.disconnect();
        reject(new Error(reason));
    };

    const connectSuccess = () => {
        socket.removeEventListener('error', connectFailed);
        resolve();
    };

    socket.once('error', connectFailed);
    socket.once('connect', connectSuccess);
    socket.connect();
});

export const request = (method, params, timeout = 3000) => new Promise((resolve, reject) => {
    if (!method) {
        reject(new Error('Missing method name'));
        return;
    }

    const payload = RPCBuilder.request(uuid(), method, params);

    socket.emit('rpc', JSON.stringify(payload));

    const timer = setTimeout(() => {
        if (pendingRequests.has(payload.id)) {
            pendingRequests.delete(payload.id);
            reject(new Error('Timeout request'));
        }
    }, timeout);

    pendingRequests.set(payload.id, { resolve, reject, timer });
});

export const notify = (name, params) => {
    if (!name) {
        throw new Error('Missing notification name');
    }

    const payload = RPCBuilder.notification(name, params);
    socket.emit('rpc', JSON.stringify(payload));
};


socket.on('rpc', (rpc) => {
    const { type, payload } = RPCBuilder.parse(rpc);

    // Не отвечаем на не валидные запросы
    if (type === 'invalid') {
        return;
    }

    if (type === 'notificaion') {
        // TODO: Пробросить до слушателей
        return;
    }

    const handler = pendingRequests.get(payload.id);

    if (handler) {
        if (type === 'success') {
            handler.resolve(payload.result);
        }

        if (type === 'error') {
            handler.reject(payload.error);
        }

        clearTimeout(handler.timer);
        pendingRequests.delete(payload.id);
    }
});
