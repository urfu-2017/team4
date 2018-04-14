'use strict';

const { JsonRpcError } = require('jsonrpc-lite');

const UserManager = require('../../managers/users');

module.exports = async (params, response) => {
    const contact = params.username ?
        await UserManager.getUser(params.username) : null;

    if (contact) {
        const currentUsername = response.socket.handshake.user.username;
        const contacts = await UserManager.getContacts(currentUsername);

        if (contacts.includes(contact.username)) {
            throw new JsonRpcError('Contact already added');
        }

        await UserManager.addContact(currentUsername, contact.username);
        response.success(contact);
        return;
    }

    throw new JsonRpcError('User not found');
};
