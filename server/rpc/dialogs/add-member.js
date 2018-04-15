'use strict';

const Chat = require('../../models/chat');
const UserManager = require('../../managers/users');
const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    const { member, chatId } = params;
    const currentUsername = response.socket.handshake.user.username;
    const chat = await Chat.find(chatId);

    // Добавление новых участников доступно только участникам
    if (!chat || chat.type === 'dialog' || !chat.members.includes(currentUsername)) {
        throw new RPC.Error('Permission denied');
    }

    chat.addMember(member);
    await Promise.all([
        UserManager.addDialog(member, chat.id),
        chat.save()
    ]);

    response.notify('addMember', { chatId: chat.id, member });
    response.success(null);
};
