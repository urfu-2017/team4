'use strict';

const RPC = require('../../utils/rpc');
const Message = require('../../models/message');

module.exports = async (params, response) => {
    const { chats } = response.socket.handshake.user;
    const { chatId } = params;

    if (!chatId || !chats.includes(chatId)) {
        throw new RPC.Error('Permission denied');
    }

    // Получаем сообщения
    let messages = await Message.getMessages(chatId);
    const lastMessage = messages[messages.length - 1];

    // Если в новом фрейме мало сообщений подгружаем ещё
    if (messages.length < 20 && lastMessage && lastMessage.frame !== 0) {
        const moreMessages = await Message.getMessages(chatId, Number(lastMessage.frame) - 1);
        messages = moreMessages.concat(messages);
    }

    response.socket.join(chatId);
    return response.success(messages);
};
