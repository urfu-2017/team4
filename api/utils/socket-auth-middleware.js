'use strict';

const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const config = require('../config');

module.exports = sessionStore => (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || '');
    const sid = cookieParser.signedCookie(cookies['connect.sid'], config.SECRET_KEY);

    sessionStore.get(sid, (err, session) => {
        if (err || !session) {
            next(new Error('authentication error'));
            return;
        }

        socket.handshake.user = session.passport.user;
        next();
    });
};
