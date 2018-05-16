import { Chat, Members, Message, Token, User } from '../models';
import { Server } from '../rpc/server';
import * as got from 'got';
import { PM_KEY } from '../config';

const headers = {
    'Authorization': `key=${PM_KEY}`,
};

export default async function(message: Message, currentUserId: number, server: Server) {
    try {
        // let options: any = { where: { chatId: message.chatId }, attributes: ['userId'] };
        // const members = (await Members.findAll(options))
        //     .map(record => record.userId)
        //     .filter((id: number) => /* !server.isAvailableUser(id) && */ id !== currentUserId);
        //
        // options = { where: { userId: { $in: members } }, attributes: ['token'] };
        const tokens = (await Token.findAll()).map(x => x.token);
        //
        // console.info(tokens);
        // if (tokens.length === 0) {
        //     return;
        // }
        //
        // const chat = (await Chat.findById(message.chatId, { attributes: ['id', 'type', 'name'] }))!;
        //
        // const { username, firstName, lastName, avatar }  = (await User.findById(message.senderId))!;
        // const name = `${firstName || ''} ${lastName || ''}`.trim() || username;
        //
        // const text = message.forwarded && message.forwarded.isReply ? 'Пересланное сообщение'
        //     : `${message.attachment ? 'Фотография.' : ''} ${message.text}`.trim();

        // const data = {
        //     id: chat.id,
        //     type: chat.type,
        //     name: chat.name,
        //     sender: { avatar, name },
        //     message: { text, createdAt: message.createdAt }
        // };

        const notification = { title: 'test' };
        const body = { registration_ids: tokens, notification };
        const res = await got('http://fcm.googleapis.com/fcm/send', { method: 'POST', headers, body, json: true });

        console.info(res.body);

    } catch (e) {
        console.error(e);
        console.info('Cannot send push');
    }
}
