'use strict';

const UserManager = require('../../managers/users');
const DialogsManager = require('../../managers/dialogs');
const RPC = require('../../utils/rpc');

/**
 * Получить диалоги текущего пользователя
 * @param params
 * @param response
 * @returns {Promise<*>}
 */
module.exports = async (params, response) => {
    try {
        const username = response.socket.handshake.session;
        const dialogIds = await UserManager.getDialogs(username);

        if (!dialogIds) {
            return response.error(new RPC.Error('User not found'));
        }

        const dialogs = await Promise.all(dialogIds.map(DialogsManager.getDialog));
        return response.success(dialogs);
    } catch (e) {
        return response.error(new RPC.Error(e.message));
    }
};
