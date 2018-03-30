'use strict';

module.exports = (params, response) => {
    response.success(response.socket.handshake.user);
};
