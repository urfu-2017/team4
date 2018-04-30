import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Message, Reaction, Chat, Members, User } from '../../models';

interface Params {
    messageId: string;
    name: string;
}

export default async function(request: Request<Params>, response: Response) {
    const { messageId, name } = request.params;
    const userId = Number(request.user);

    const message = await Message.findById(messageId, {
        attributes: ['id', 'chatId'],
    });

    if (!message) {
        throw new Error('Permission denied');
    }

    const isMember = await Members.findOne({ where: { chatId: message.chatId, userId } });

    if (!isMember) {
        throw new Error('Permission denied');
    }

    const reaction = await Reaction.create<Reaction>({
        userId,
        messageId,
        reaction: name
    });

    response.success(true);
    response.notification(message.chatId, 'NEW_REACTION', reaction.toJSON());
}
