'use strict';

const Message = require('../../models/message');
const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    try {
        const { chatId, frame } = params;
        const { chats } = response.socket.handshake.user;

        if (!chatId || !chats.find(chatId)) {
            throw new Error('Permission denied');
        }

        const messages = await Message.getMessages(chatId, Number(frame));
        response.success(messages);
    } catch (e) {
        response.error(new RPC.Error(e.message));
    }
};
