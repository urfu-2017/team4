'use strict';

const DialogsManager = require('../../managers/dialogs');
const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    try {
        const from = response.socket.handshake.session;
        const { chatId, text } = params;

        if (!text) {
            response.error(new RPC.Error('Текст не может быть пустым'));
            return;
        }

        const message = await DialogsManager.addMessage(chatId, { text, from });
        response.success(message);
        response.notify(chatId, 'newMessage', message);
    } catch (e) {
        console.error(e);
        response.error(new RPC.Error(e.message));
    }
};
