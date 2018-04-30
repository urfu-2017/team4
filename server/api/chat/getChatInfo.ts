import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import findChat from './findChat';

export default async function getChatInfo(request: Request<{ chatId: string; subscribe?: boolean }>, response: Response) {
    const chat = await findChat(request.user, request.params.chatId);

    if (request.params.subscribe) {
        await request.server.subscribeUser(String(request.user), chat!.id);
    }

    response.success(chat);
}
