'use strict';

const cookie = require('cookie');
const cookieParser = require('cookie-parser');

const config = require('../config');
const UserManager = require('../managers/users');

module.exports = (sessionStore, usersStore) => (socket, next) => {
    const { handshake } = socket;

    const cookies = cookie.parse(handshake.headers.cookie || '');
    const sid = cookieParser.signedCookie(cookies['connect.sid'], config.SECRET_KEY);

    sessionStore.get(sid, async (err, session) => {
        if (err || !session) {
            next(new Error('authentication error'));
            return;
        }

        // Прикрепляем сокет к определённому пользователю
        const username = session.passport.user;
        let userInfo = usersStore.get(username);

        if (!userInfo) {
            userInfo = await UserManager.getUser(username);
            userInfo.chats = await UserManager.getDialogs(username);
            userInfo.sockets = [socket];
            userInfo.sid = sid;

            usersStore.set(username, userInfo);
        } else {
            userInfo.sockets.push(socket);
            userInfo.sid = sid;
        }

        handshake.user = userInfo;
        next();
    });
};
