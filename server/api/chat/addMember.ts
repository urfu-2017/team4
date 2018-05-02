import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Members } from '../../models';

import findChat from './findChat';
import { JsonRpcError } from 'jsonrpc-lite';
import { Events } from '../../../shared/events';

interface Params {
    chatId: string;
    userId: number;
}

export default async function(request: Request<Params>, response: Response) {
    const { chatId, userId } = request.params;
    const chat = await findChat(request.user, chatId);

    if (chat.type === 'dialog') {
        // TODO: Придумать сообщение об ошибке
        throw new JsonRpcError('Chat is dialog', 400);
    }

    await Members.create<Members>({ userId, chatId });

    response.notification(chatId, Events.ADD_MEMBER, { userId });
    await request.server.subscribeUser(userId, chatId);
    response.success(null);
}
