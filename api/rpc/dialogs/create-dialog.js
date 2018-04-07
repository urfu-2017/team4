'use strict';

const DialogsManager = require('../../managers/dialogs');
const UsersManager = require('../../managers/users');
const RPC = require('../../utils/rpc');

module.exports = async (params, response, io) => {
    try {
        const owner = response.socket.handshake.session;
        let { members } = params;
        const { name = 'New chat' } = params;

        // Убираем дубликат создателя чата
        members = members.filter(id => id !== owner).concat(owner);

        const dialog = await DialogsManager.createDialog({ name, members, owner, type: 'group' });
        await Promise.all(members.map(member => UsersManager.addDialog(member, dialog)));

        // Подключаем участников к комнате
        members.forEach((member) => {
            if (io.users[member]) {
                io.users[member].join(dialog.id);
            }
        });

        response.success(dialog);
    } catch (e) {
        response.error(new RPC.Error('Internal error'));
    }
};
