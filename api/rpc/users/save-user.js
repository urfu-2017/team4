'use strict';

const UserManager = require('../../managers/users');

module.exports = async (params, response) => {
    if (params.username === response.socket.handshake.user.username) {
        response.success(params);
        console.log(params);
        UserManager.saveUser(params);
    } else {
        throw new Error('It\'s not you');
    }
};
