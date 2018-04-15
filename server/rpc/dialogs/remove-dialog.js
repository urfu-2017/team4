'use strict';

const Chat = require('../../models/chat');
const Message = require('../../models/message');
const UserManager = require('../../managers/users');
const RPC = require('../../utils/rpc');

module.exports = async (params, response, io) => {
    const chat = await Chat.find(params.chatId);
    const { username } = response.socket.handshake.user;

    // Можно удалить комнату, если ты владелец или если чат персональный,
    // то нужно быть его участником
    const canRemove = chat && (chat.owner === username || (
        chat.type === 'dialog' && chat.members.includes(username)));

    if (!canRemove) {
        throw new RPC.Error('Permission denied');
    }

    chat.members.forEach((member) => {
        UserManager.removeDialog(member, chat.id);
        const userInfo = io.users.get(member);

        if (userInfo) {
            userInfo.chats = userInfo.chats.filter(id => id !== chat.id);
            userInfo.sockets.forEach(socket => socket.leave(chat.id));
        }
    });

    await Message.removeAllMessages(chat.id);
    await Chat.remove(chat.id);

    response.notify('removeChat', { chatId: chat.id });
    response.success(null);
};
