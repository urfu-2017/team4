import { Chat, User } from '../../../models';
import { JsonRpcError } from 'jsonrpc-lite';

export const findUserChat = async (userId: number, chatId: string): Promise<Chat> => {
    const currentUser = (await User.findById(userId, {
        include: [
            {
                model: Chat,
                where: {
                    id: chatId
                },
                include: [
                    {
                        model: User
                    }
                ]
            }
        ]
    }))!;

    const chat = currentUser.chats[0];

    if (!chat) {
        throw new JsonRpcError('No such chat', 404);
    }

    return chat;
};

export const findChat = async (chatId: string): Promise<Chat> => {
    const chat = await Chat.findById<Chat>(chatId, {
        include: [
            {
                model: User
            }
        ]
    });

    if (!chat) {
        throw new JsonRpcError('No such chat', 404);
    }

    return chat;
};
