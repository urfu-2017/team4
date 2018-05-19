import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Members } from '../../models';

export default async function subscribeToChat(
    request: Request<{ chatId: string }>,
    response: Response
) {
    const memberData = await Members.findOne({
        where: {
            userId: request.user,
            chatId: request.params.chatId
        }
    });

    if (!memberData) {
        return response.error(404, 'No such chat');
    }

    await request.server.subscribeUser(request.user, request.params.chatId);

    response.success(null);
}
