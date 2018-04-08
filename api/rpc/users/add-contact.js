'use strict';

const { JsonRpcError } = require('jsonrpc-lite');

const UserManager = require('../../managers/users');

module.exports = async (params, response) => {
    const contact = params.username ?
        await UserManager.getUser(params.username) : null;

    if (contact) {
        await UserManager.addContact(response.socket.handshake.user.username, contact.username);
        response.success(contact);
        return;
    }

    response.error(new JsonRpcError('User not found'));
};
