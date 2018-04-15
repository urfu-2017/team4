'use strict';

const Session = require('../../models/session');

module.exports = (params, response) => {
    const { user } = response.socket.handshake;

    Session.destroy(user.sid, () => {
        user.sockets.forEach(socket => socket.disconnect());
    });
};
