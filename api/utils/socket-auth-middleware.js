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

        handshake.session = session.passport.user;
        handshake.user = await UserManager.getUser(session.passport.user);

        next();
    });
};
