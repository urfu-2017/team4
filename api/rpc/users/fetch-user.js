'use strict';

const User = require('../../models/user');
const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    const user = params.username ?
        await User.get(params.username) : response.socket.handshake.user;

    if (!user) {
        throw new RPC.Error('User not found');
    }

    response.success(user);
};
