'use strict';

const User = require('../../models/user');
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
    await Promise.all(chat.members.map(member =>
        User.get(member).then(user => user.addToChat(chat.id))));

    // Подключаем участников к комнате
    members.forEach((member) => {
        const socket = io.users[member];
        if (socket) {
            socket.join(chat.id);
        }
    });

    response.success(chat);
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
