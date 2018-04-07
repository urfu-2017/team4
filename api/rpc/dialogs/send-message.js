'use strict';

const Message = require('../../managers/dialogs');
const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    try {
        const { username, chats } = response.socket.handshake.user;
        const { chatId, text } = params;

        if (!chats.find(chatId)) {
            throw new Error('Permission denied');
        }

        if (!text) {
            response.error(new RPC.Error('Message body is empty'));
            return;
        }

        const message = (await new Message({ chatId, text, from: username }).save());

        response.success(message);
        response.notify(chatId, 'newMessage', message);
    } catch (e) {
        response.error(new RPC.Error(e.message));
    }
};
