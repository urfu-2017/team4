import { Chat, Members, Message, Token, User } from '../models';
import { Server } from '../rpc/server';
import * as got from 'got';
import { PM_KEY } from '../config';
import findMentions from '../../shared/utils/findMentions';
import { findUserChat } from '../api/chat/helpers/findChat';

const headers = {
    'Authorization': `key=${PM_KEY}`,
};

export default async function(message: any, currentUserId: number, server: Server) {
    try {
        const { createdAt, text, attachment, forwarded, senderId, chatId, timeToDeath } = message;

        const chat = await findUserChat(currentUserId, chatId);

        const mentions = findMentions(text);
        const mentionedUserIds = chat.members
            .filter(user => mentions.includes(user.username.toLowerCase()))
            .map(user => user.id);

        const members = (await Members.findAll({ where: { chatId }, attributes: ['userId', 'mute'] }))
            .filter(record => !record.mute || mentionedUserIds.includes(record.userId))
            .map(record => record.userId)
            .filter((id: number) => !server.isAvailableUser(id) && id !== currentUserId);

        const options = { where: { userId: members }, attributes: ['token'] };
        const tokens = (await Token.findAll(options)).map(x => x.token);

        if (tokens.length === 0) {
            return;
        }

        const { username, firstName, lastName, avatar }  = (await User.findById(message.senderId))!;
        const name = `${firstName || ''} ${lastName || ''}`.trim() || username;

        const data = {
            id: chat.id,
            type: chat.type,
            name: chat.name,
            sender: { avatar, name },
            message: { text, createdAt, attachment, forwarded }
        };

        const body = {
            registration_ids: tokens,
            data,
            time_to_live: Math.round(timeToDeath / 1000)
        };
        await got('https://fcm.googleapis.com/fcm/send', { method: 'POST', headers, body, json: true });
    } catch (e) {
        console.error(e);
        console.info('Cannot send push');
    }
}
