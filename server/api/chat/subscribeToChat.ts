import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import findChat from './findChat';

export default async function subscribeToChat(request: Request<{ chatId: string }>, response: Response) {
    const chat = await findChat(request.user, request.params.chatId);
    request.server.subscribeUser(request.user, chat.id);
    response.success(chat);
}
