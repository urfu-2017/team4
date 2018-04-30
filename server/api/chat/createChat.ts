import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Chat, Members, User } from '../../models/index';
import { v4 as uuid } from 'uuid';

export default async function createChat(request: Request<{ type: 'dialog' | 'room'; members: number[], name?: string }>, response: Response) {
    const {type, members, name} = request.params;
    let chat = await Chat.create({
        id: uuid(),
        name,
        ownerId: type === 'room' ? request.user : null,
        type
    });
    const currentUserId = Number(request.user);
    if (!members.includes(currentUserId)) {
        members.push(currentUserId);
    }
    await Members.bulkCreate(members.map(userId => ({
        userId,
        chatId: chat.id
    })));
    chat = await Chat.findById(chat.id, {
        include: {
            model: User
        }
    });
    members.map(userId => userId.toString()).forEach(userId => {
        request.server.subcribeUser(userId, chat.id);
        response.notification(userId, 'newChat', chat);
    });
    response.success(chat);
}
