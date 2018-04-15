'use strict';

const Message = require('../../models/message');
const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    const { username, chats } = response.socket.handshake.user;
    const { chatId, text, ogData } = params;

    if (!chats.includes(chatId)) {
        throw new Error('Permission denied');
    }

    if (!text.trim()) {
        throw new RPC.Error('Message body is empty');
    }

    const data = {
        ogData,
        chatId,
        text: text.trim(),
        from: username
    };

    const message = (await new Message(data).save());

    response.success(message);
    response.notify(chatId, 'newMessage', message);
};
