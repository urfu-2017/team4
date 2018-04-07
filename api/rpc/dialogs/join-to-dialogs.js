'use strict';

const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    try {
        const { chats } = response.socket.handshake.user;
        let { dialogs } = params;

        if (!dialogs || !Array.isArray(dialogs)) {
            return response.error(new RPC.Error('Invalid params'));
        }

        // Оставляем только те диалоги, в которых есть пользователь
        dialogs = dialogs.filter(id => !!chats.includes(id));

        // eslint-disable-next-line no-restricted-syntax
        for (const dialogId of dialogs) {
            response.socket.join(dialogId);
        }

        return response.success(null);
    } catch (e) {
        console.error(e);
        return response.error(new RPC.Error('Internal error'));
    }
};
