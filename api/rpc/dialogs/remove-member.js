'use strict';

const Chat = require('../../models/chat');
const UserManager = require('../../managers/users');
const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    const currentUsername = response.socket.handshake.user.username;
    const { member = currentUsername, chatId } = params;
    const chat = await Chat.find(chatId);

    // Может удалить, если запрос от самого участника или владельца комнаты
    if (!chat || !chat.owner !== currentUsername || currentUsername === member) {
        throw new RPC.Error('Permission denied');
    }

    // Запрещаем админу удалить себя
    if (chat.owner === currentUsername) {
        throw new RPC.Error('Use remove dialog');
    }

    chat.removeMember(member);
    await Promise.all([
        UserManager.removeDialog(member, chat.id),
        chat.save()
    ]);

    response.notify('removeMember', { chatId: chat.id, member });
    response.success(null);
};
