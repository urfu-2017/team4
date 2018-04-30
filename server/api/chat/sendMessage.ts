import { v4 as uuid } from 'uuid';
import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Message } from '../../models/message';
import findChat from './findChat';

export default async function sendMessage(request: Request<{ chatId: string; text: string; meta?: any }>, response: Response) {
    const {chatId, text, meta} = request.params;
    const chat = findChat(request.user, chatId);
    if (!chat) {
        return response.error(404, 'No such chat');
    }
    const message = await Message.create({
        id: uuid(),
        senderId: request.user,
        chatId,
        text,
        meta
    });
    response.notification(chatId, 'newMessage', message);
    response.success(message);
}
