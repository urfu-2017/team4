import { User, Chat } from '../../models/index';
import { JsonRpcError } from 'jsonrpc-lite';

export default async function findChat(userId: string, chatId: string): Promise<Chat | null> {
    const chat = await Chat.findById(chatId, {
        include: {
            model: User,
            where: {
                id: userId
            }
        }
    });
    if (!chat) {
        throw new JsonRpcError('No such chat', 404);
    }

    return chat;
}
