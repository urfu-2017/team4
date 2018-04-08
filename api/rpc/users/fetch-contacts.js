'use strict';

const UserManager = require('../../managers/users');

module.exports = async (params, response) => {
    const currentUsername = response.socket.handshake.session;
    response.success(await UserManager.getContacts(currentUsername));
};
