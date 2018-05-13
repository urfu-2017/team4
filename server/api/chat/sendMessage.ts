import { v4 as uuid } from 'uuid';
import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Members, Message } from '../../models';
import { Events } from '../../../shared/events';

interface Params {
    chatId: string;
    text: string;
    attachment?: string;
    deathTime?: Date;
}

export default async function sendMessage(request: Request<Params>, response: Response) {
    const { chatId, text, attachment, timeToDeath } = request.params;
    const members = await Members.findOne({
        where: {
            userId: request.user,
            chatId
        }
    });

    if (!members) {
        return response.error(404, 'No such chat');
    }

    const message = await Message.create({
        id: uuid(),
        senderId: request.user,
        chatId,
        text,
        attachment,
        deathTime: new Date(new Date().getTime() + timeToDeath)
    });

    const messageWithTimeToDeath = {...message.dataValues, timeToDeath};

    response.notification(chatId, Events.NEW_MESSAGE, messageWithTimeToDeath);
    response.success(messageWithTimeToDeath);
}
