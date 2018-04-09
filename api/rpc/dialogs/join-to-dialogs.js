'use strict';

const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    const { chatsIds } = response.socket.handshake.user;
    let { dialogs } = params;

    if (!dialogs || !Array.isArray(dialogs)) {
        throw new RPC.Error('Invalid params');
    }

    // Оставляем только те диалоги, в которых есть пользователь
    dialogs = dialogs.filter(id => chatsIds.includes(id));

    // eslint-disable-next-line no-restricted-syntax
    for (const dialogId of dialogs) {
        response.socket.join(dialogId);
    }

    return response.success(null);
};
