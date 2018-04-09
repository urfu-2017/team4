'use strict';

const Message = require('../../models/message');
const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    const { username, chatsIds } = response.socket.handshake.user;
    const { chatId, text } = params;

    if (!chatsIds.includes(chatId)) {
        throw new Error('Permission denied');
    }

    if (!text.trim()) {
        throw new RPC.Error('Message body is empty');
    }

    const message = (await new Message({ chatId, text: text.trim(), from: username }).save());

    response.success(message);
    response.notify(chatId, 'newMessage', message);
};
