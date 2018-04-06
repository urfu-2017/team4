'use strict';

const DialogsManager = require('../../managers/dialogs');
const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    try {
        const { chatId, frame = 0 } = params;
        const messages = await DialogsManager.getMessages(chatId, frame);

        response.success(messages);
    } catch (e) {
        console.error(e);
        response.error(new RPC.Error(e.message));
    }
};
