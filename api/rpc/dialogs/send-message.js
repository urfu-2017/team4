'use strict';

const Message = require('../../models/message');
const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    const { username, chats } = response.socket.handshake.user;
    const { chatId, text } = params;

    if (!chats.includes(chatId)) {
        throw new Error('Permission denied');
    }

    if (!text) {
        throw new RPC.Error('Message body is empty');
    }

    const message = (await new Message({ chatId, text, from: username }).save());

    response.success(message);
    response.notify(chatId, 'newMessage', message);
};
