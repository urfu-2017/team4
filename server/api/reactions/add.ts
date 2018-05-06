import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Message, Reaction, Members } from '../../models';
import { Events } from '../../../shared/events';

interface Params {
    messageId: string;
    name: string;
}

export default async function(request: Request<Params>, response: Response) {
    const { messageId, name } = request.params;
    const userId = Number(request.user);

    const message = await Message.findById(messageId, {
        attributes: ['id', 'chatId']
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

    const reactionJSON = { ...reaction.toJSON(), chatId: message.chatId };

    response.success(reactionJSON);
    response.notification(message.chatId, Events.ADD_REACTION, reactionJSON);
}
