'use strict';

const UserManager = require('../../managers/users');

module.exports = async (params, response) => {
    const currentUsername = response.socket.handshake.user.username;
    const contacts = await UserManager.getContacts(currentUsername);

    response.success(contacts.filter(contact => contact !== null));
};
