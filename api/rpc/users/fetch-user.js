'use strict';

const UserManager = require('../../managers/users');

module.exports = async (params, response) => {
    const user = params.username ?
        await UserManager.getUser(params.username) : response.socket.handshake.user;

    if (user) {
        response.success(user);
        return;
    }

    response.error(new Error('User not found'));
};
