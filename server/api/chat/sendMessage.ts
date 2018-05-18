import { v4 as uuid } from 'uuid';
import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Message } from '../../models';
import { Events } from '../../../shared/events';

import sendPush from '../../helpers/sendPush';
import { findUserChat } from './helpers/findChat';
import findMentions from '../../../shared/utils/findMentions';

interface Params {
    chatId: string;
    text: string;
    attachment?: string;
    timeToDeath?: number;
    forwarded?: any;
}
export default async function sendMessage(request: Request<Params>, response: Response) {
    const { chatId, text, attachment, timeToDeath, forwarded } = request.params;

    const chat = await findUserChat(request.user, chatId);

    const deathTime = timeToDeath
        ? new Date(new Date().getTime() + timeToDeath)
        : null;

    const dbMessage = await Message.create({
        id: uuid(),
        senderId: request.user,
        chatId,
        text,
        attachment,
        deathTime,
        forwarded
    });

    const mentions = findMentions(dbMessage.text);
    const mentionedUserIds = chat.members
        .filter(user => mentions.includes(user.username.toLowerCase()))
        .map(user => user.id);

    const message = {...dbMessage.dataValues, timeToDeath};

    sendPush(message as any, request.user, mentionedUserIds, request.server);
    response.notification(chatId, Events.NEW_MESSAGE, message);
    response.success(message);
}
