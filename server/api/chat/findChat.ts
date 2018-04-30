import { User, Chat } from '../../models/index';
import { JsonRpcError } from 'jsonrpc-lite';

export default async function findChat(userId: number, chatId: string): Promise<Chat | null> {
    const currentUser = (await User.findById(userId, {
        include: [{
            model: Chat,
            where: {
                id: chatId
            },
            include: [{
                model: User
            }]
        }]
    }))!;

    const chat = currentUser.chats[0];

    if (!chat) {
        throw new JsonRpcError('No such chat', 404);
    }

    return chat;
}
