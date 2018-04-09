'use strict';

const cookie = require('cookie');
const cookieParser = require('cookie-parser');

const config = require('../config');
const User = require('../models/user');

module.exports = sessionStore => (socket, next) => {
    const { handshake } = socket;

    const cookies = cookie.parse(handshake.headers.cookie || '');
    const sid = cookieParser.signedCookie(cookies['connect.sid'], config.SECRET_KEY);

    sessionStore.get(sid, async (err, session) => {
        if (err || !session) {
            next(new Error('authentication error'));
            return;
        }

        const username = session.passport.user;
        handshake.user = await User.get(username);
        next();
    });
};
