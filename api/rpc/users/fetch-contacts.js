'use strict';

module.exports = async (params, response) => {
    const currentUser = response.socket.handshake.user;
    response.success(await currentUser.getContacts());
};
