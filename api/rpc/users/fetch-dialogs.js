'use strict';

const Chat = require('../../models/chat');
const RPC = require('../../utils/rpc');

/**
 * Получить диалоги текущего пользователя
 * @param params
 * @param response
 * @returns {Promise<*>}
 */
module.exports = async (params, response) => {
    try {
        const chatIds = response.socket.handshake.user.chats;

        const chats = await Promise.all(chatIds.map(Chat.find));
        return response.success(chats);
    } catch (e) {
        return response.error(new RPC.Error(e.message));
    }
};
