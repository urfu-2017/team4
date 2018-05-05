import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Reaction, Message } from '../../models';
import { Events } from '../../../shared/events';

interface Params {
    reactionId: number;
}

export default async function(request: Request<Params>, response: Response) {
    const userId = Number(request.user);
    const reaction = await Reaction.findById(request.params.reactionId);

    if (!reaction || reaction.userId !== userId) {
        throw new Error('Permission denied');
    }

    await reaction.destroy();

    const message = (await Message.findById(reaction.messageId, { attributes: ['id', 'chatId'] }))!;
    
    response.success(true);
    response.notification(message.chatId, Events.REMOVE_REACTION, {
        chatId: message.chatId,
        reaction: request.params.reactionId,
        messageId: message.id
    });
}
