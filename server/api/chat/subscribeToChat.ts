import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { findUserChat } from './helpers/findChat';

export default async function subscribeToChat(
    request: Request<{ chatId: string }>,
    response: Response
) {
    const chat = await findUserChat(request.user, request.params.chatId);
    await request.server.subscribeUser(request.user, chat!.id);

    response.success(chat);
}
