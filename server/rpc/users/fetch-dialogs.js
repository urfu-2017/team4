'use strict';

const Chat = require('../../models/chat');

/**
 * Получить диалоги текущего пользователя
 * @param params
 * @param response
 * @returns {Promise<*>}
 */
module.exports = async (params, response) => {
    const chatIds = response.socket.handshake.user.chats;

    const chats = await Promise.all(chatIds.map(Chat.find));
    return response.success(chats);
};
