import { v4 as uuid } from 'uuid';
import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Message } from '../../models';
import { Events } from '../../../shared/events';

import sendPush from '../../helpers/sendPush';
import { Members } from '../../models/members';

interface Params {
    chatId: string;
    text: string;
    attachment?: string;
    timeToDeath?: number;
    forwarded?: any;
}
export default async function sendMessage(request: Request<Params>, response: Response) {
    const { chatId, text, attachment, timeToDeath, forwarded } = request.params;

    const memberData = await Members.findOne({
        where: {
            userId: request.user,
            chatId: request.params.chatId
        }
    });

    if (!memberData) {
        return response.error(404, 'No such chat');
    }

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

    const message = {...dbMessage.dataValues, timeToDeath};

    sendPush(message, request.user, request.server);
    response.notification(chatId, Events.NEW_MESSAGE, message);
    response.success(message);
}
