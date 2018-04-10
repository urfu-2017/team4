'use strict';

const Chat = require('../../models/chat');
const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    const { chats } = response.socket.handshake.user;
    const { chatId } = params;

    if (!chatId || !chats.includes(chatId)) {
        throw new RPC.Error('Permission denied');
    }

    const chat = await Chat.find(chatId);
    response.success(chat);
};
