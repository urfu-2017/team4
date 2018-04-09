'use strict';

const Chat = require('../../models/chat');

/**
 * Получить диалоги текущего пользователя
 * @param params
 * @param response
 * @returns {Promise<*>}
 */
module.exports = async (params, response) => {
    const { chatsIds } = response.socket.handshake.user;

    const chats = await Promise.all(chatsIds.map(Chat.find));
    return response.success(chats);
};
