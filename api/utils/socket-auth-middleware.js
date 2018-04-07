'use strict';

const cookie = require('cookie');
const cookieParser = require('cookie-parser');

const config = require('../config');
const UserManager = require('../managers/users');

module.exports = sessionStore => (socket, next) => {
    const { handshake } = socket;

    const cookies = cookie.parse(handshake.headers.cookie || '');
    const sid = cookieParser.signedCookie(cookies['connect.sid'], config.SECRET_KEY);

    sessionStore.get(sid, async (err, session) => {
        if (err || !session) {
            next(new Error('authentication error'));
            return;
        }

        const userId = session.passport.user;
        const user = await UserManager.getUser(userId);
        user.chats = (await UserManager.getDialogs(userId)) || [];

        handshake.user = user;
        next();
    });
};
