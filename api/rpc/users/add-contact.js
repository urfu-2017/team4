'use strict';

const RPC = require('../../utils/rpc');

const User = require('../../models/user');

module.exports = async (params, response) => {
    const currentUser = response.socket.handshake.user;

    if (params.username === currentUser.username) {
        throw new RPC.Error('Cannot add himself to contacts');
    }

    const contact = params.username ?
        await User.get(params.username) : null;

    if (contact) {
        await currentUser.addContact(contact.username);
        response.success(contact);
        return;
    }

    throw new RPC.Error('User not found');
};
