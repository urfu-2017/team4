'use strict';

const path = require('path');
const sio = require('socket.io');
const express = require('express');

const expressAuth = require('./utils/auth');
const RPC = require('./utils/rpc');
const SessionStore = require('./utils/sessions-store');
const socketAuth = require('./utils/socket-auth-middleware');
const configureRPC = require('./rpc');

const app = express();
const sessionStore = new SessionStore();
const usersStore = new Map();

app.use(express.static(path.resolve(__dirname, '..', 'prod_build'), { redirect: false }));
expressAuth(app, sessionStore);

const server = app.listen(8080);
const io = sio.listen(server);
configureRPC();

io.use(socketAuth(sessionStore, usersStore));
io.users = usersStore;

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        const { user } = socket.handshake;
        user.sockets = user.sockets.filter(sckt => sckt !== socket);

        if (user.sockets.length === 0) {
            usersStore.delete(user.username);
        }
    });

    socket.on('rpc', async (rpc) => {
        const { payload, type } = RPC.Builder.parse(rpc);

        // Не отвечаем на невалидный запрос
        if (type === 'invalid') {
            return;
        }

        const method = RPC.Registry.get(payload.method);
        const response = new RPC.Response(payload.id, socket);

        if (method === null) {
            response.error(RPC.Error.methodNotFound());
            return;
        }

        try {
            await method(payload.params || {}, response, io);
        } catch (e) {
            if (e instanceof RPC.Error) {
                response.error(e);
            } else {
                response.error(new RPC.Error('Internal error', 500, e.message));
            }
        }
    });
});
