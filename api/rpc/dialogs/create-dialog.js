'use strict';

const UsersManager = require('../../managers/users');
const Chat = require('../../models/chat');
const RPC = require('../../utils/rpc');

/**
 * Создаёт новый чат
 * Если чат является диалогом, то берёт первого участника из members
 * @param params
 * @param response
 * @param io
 */
module.exports = async (params, response, io) => {
    try {
        const owner = response.socket.handshake.user.username;
        const { type, members, name } = params;

        if (!members.length) {
            throw new RPC.Error('Empty members');
        }

        let chat;
        if (type === 'dialog') {
            chat = await createDialog(owner, members[0]);
        } else if (type === 'room') {
            chat = Chat.createRoom(name, owner, members);
        } else {
            throw new RPC.Error('Invalid type');
        }

        await chat.save();
        await Promise.all(chat.members.map(member => UsersManager.addDialog(member, chat.id)));

        // Подключаем участников к комнате
        members.forEach((member) => {
            const socket = io.users[member];
            if (socket) {
                socket.handshake.user.chats.push(chat.id);
                socket.join(chat.id);
            }
        });

        console.info('SUCCESS CREATE', chat.id);
        response.success(chat);
    } catch (e) {
        console.error(e);
        response.error(e);
    }
};

async function createDialog(person1, person2) {
    if (!person1 || !person2) {
        throw new RPC.Error('Member cannot be empty');
    }

    const chat = Chat.createDialog(person1, person2);

    if (await Chat.find(chat.id)) {
        throw new RPC.Error('Dialog is exists');
    }

    return chat;
}
