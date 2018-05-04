import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Members } from '../../models';

import { Events } from '../../../shared/events';
import { findChat } from './helpers/findChat';

interface Params {
    chatId: string;
    userId: number;
}

export default async function(request: Request<Params>, response: Response) {
    const { chatId, userId } = request.params;
    const chat = await findChat(chatId);

    if (chat.type === 'dialog') {
        return response.error(400, 'Chat is dialog');
    }

    if (chat.members.find(user => user.id === userId)) {
        return response.error(409, 'User is already a chat member');
    }

    if (!chat.hasMember(request.user) && userId !== request.user) {
        return response.error(403, 'Permission denied');
    }

    await Members.create<Members>({ userId, chatId });

    await request.server.subscribeUser(userId, chatId);
    response.notification(chatId, Events.ADD_MEMBER, { userId, chatId });
    response.success(chat);
}
