'use strict';

const Message = require('../../models/message');
const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    const { chatId, frame } = params;
    const { chatsIds } = response.socket.handshake.user;

    if (!chatId || !chatsIds.includes(chatId)) {
        throw new RPC.Error('Permission denied');
    }

    const messages = await Message.getMessages(chatId, Number(frame));
    response.success(messages);
};
