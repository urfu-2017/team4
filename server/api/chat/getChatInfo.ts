import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { findChat } from './helpers/findChat';

export default async function getChatInfo(
    request: Request<{ chatId: string; subscribe?: boolean }>,
    response: Response
) {
    const chat = await findChat(request.params.chatId);

    if (!chat.hasMember(request.user) && chat.type === 'dialog') {
        return response.error(403, 'Permission denied');
    }

    if (request.params.subscribe) {
        await request.server.subscribeUser(request.user, chat!.id);
    }

    response.success(chat);
}
