import { Chat, Members, Message, Token, User } from '../models';
import { Server } from '../rpc/server';
import * as got from 'got';
import { PM_KEY } from '../config';

const headers = {
    'Authorization': `key=${PM_KEY}`,
};

export default async function(message: Message, currentUserId: number, forcedUserIds: number[], server: Server) {
    try {
        const { createdAt, text, attachment, forwarded, senderId, chatId } = message;

        const members = (await Members.findAll({ where: { chatId }, attributes: ['userId', 'mute'] }))
            .filter(record => !record.mute || forcedUserIds.includes(record.userId))
            .map(record => record.userId)
            .filter((id: number) => !server.isAvailableUser(id) && id !== currentUserId);

        const options = { where: { userId: members }, attributes: ['token'] };
        const tokens = (await Token.findAll(options)).map(x => x.token);

        if (tokens.length === 0) {
            return;
        }

        const chat = (await Chat.findById(chatId, { attributes: ['id', 'type', 'name'] }))!;

        const { username, firstName, lastName, avatar }  = (await User.findById(message.senderId))!;
        const name = `${firstName || ''} ${lastName || ''}`.trim() || username;

        const data = {
            id: chat.id,
            type: chat.type,
            name: chat.name,
            sender: { avatar, name },
            message: { text, createdAt, attachment, forwarded }
        };

        const body = { registration_ids: tokens, data };
        await got('https://fcm.googleapis.com/fcm/send', { method: 'POST', headers, body, json: true });
    } catch (e) {
        console.error(e);
        console.info('Cannot send push');
    }
}
