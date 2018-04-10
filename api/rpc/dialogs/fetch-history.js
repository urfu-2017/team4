'use strict';

const Message = require('../../models/message');
const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    const { chatId, frame } = params;
    const { chats } = response.socket.handshake.user;

    if (!chatId || !chats.includes(chatId)) {
        throw new RPC.Error('Permission denied');
    }

    // Удаляем дубликаты
    // TODO: Отвественность модели
    let messages = await Message.getMessages(chatId, Number(frame));
    messages = messages.filter((message, pos, self) =>
        self.findIndex(msg => msg.id === message.id) === pos);

    response.success(messages);
};

