'use strict';

const path = require('path');
const sio = require('socket.io');
const express = require('express');

const expressAuth = require('./utils/auth');
const DbClient = require('./helpers/dbclient');

const SessionStore = require('./utils/sessions-store');
const socketAuth = require('./utils/socket-auth-middleware');

const RPC = require('./utils/rpc');
const fetchUser = require('./rpc/users/fetch-user');

RPC.Registry.register('fetchUser', fetchUser);

const app = express();
const sessionStore = new SessionStore(DbClient);

app.use(express.static(path.resolve(__dirname, '..', 'prod_build'), { redirect: false }));
expressAuth(app, sessionStore);

const server = app.listen(8080);
const io = sio.listen(server);

io.use(socketAuth(sessionStore));

io.on('connection', (socket) => {
    socket.on('rpc', (rpc) => {
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

        method(payload.params || {}, response);
    });
});
