'use strict';

const UserManager = require('../../managers/users');
const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    let user;

    if (params.username) {
        user = await UserManager.getUser(params.username);
    } else {
        const { username, firstName, lastName } = response.socket.handshake.user;
        user = { username, firstName, lastName };
    }

    if (!user) {
        throw new RPC.Error('User not found');
    }

    response.success(user);
};
