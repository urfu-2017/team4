'use strict';

const DialogsManager = require('../../managers/dialogs');
const UsersManager = require('../../managers/users');
const RPC = require('../../utils/rpc');

module.exports = async (params, response, io) => {
    try {
        const owner = response.socket.handshake.session;
        const { userId } = params;

        // Сортируем для однозначного отображения в id
        const members = [owner, userId].sort((a, b) => a.localeCompare(b));
        const name = 'Personal chat';
        const id = members.join('_');

        // Если диалог уже есть
        if (await DialogsManager.getDialog(name)) {
            return response.error(new RPC.Error('Dialog exists'));
        }

        const dialogInfo = { id, name, members, owner: 'server', type: 'personal' };
        const dialog = await DialogsManager.createDialog(dialogInfo);
        await Promise.all(members.map(member => UsersManager.addDialog(member, dialog)));

        members.forEach((member) => {
            if (io.users[member]) {
                io.users[member].join(dialog.id);
            }
        });

        return response.success(dialog);
    } catch (e) {
        return response.error(new RPC.Error('Internal error'));
    }
};
