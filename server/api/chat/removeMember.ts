import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Members } from '../../models';

import { findUserChat } from './helpers/findChat';
import { Events } from '../../../shared/events';

interface Params {
    chatId: string;
    userId: number;
}

export default async function(request: Request<Params>, response: Response) {
    const { chatId, userId } = request.params;
    const chat = await findUserChat(request.user, chatId);

    if (chat.type === 'dialog') {
        return response.error(400, 'Chat is dialog');
    }

    await Members.destroy({ where: { userId, chatId } });

    response.notification(chatId, Events.REMOVE_MEMBER, { userId, chatId });
    await request.server.unsubscribeUser(userId, chatId);
    response.success(null);
}
