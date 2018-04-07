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

app.use(express.static(path.resolve(__dirname, '..', 'prod_build'), { redirect: false }));
expressAuth(app, sessionStore);

const server = app.listen(8080);
const io = sio.listen(server);
configureRPC();

io.use(socketAuth(sessionStore));

io.on('connection', (socket) => {
    io.users = io.users || {};

    socket.on('connect', () => {
        const user = socket.handshake.session;
        io.users[user] = socket;
    });

    socket.on('rpc', (rpc) => {
        const { payload, type } = RPC.Builder.parse(rpc);

        // Не отвечаем на невалидный запрос
        if (type === 'invalid') {
            return;
        }

        const method = RPC.Registry.get(payload.method);
        const response = new RPC.Response(payload.id, socket);

        if (method === null) {
            console.info(payload.method);
            response.error(RPC.Error.methodNotFound());
            return;
        }

        method(payload.params || {}, response, io);
    });

    socket.on('disconnect', () => {
        const user = socket.handshake.session;
        delete io.users[user];
    });
});
