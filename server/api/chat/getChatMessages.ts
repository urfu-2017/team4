import { Sequelize } from 'sequelize-typescript';

import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Message, Reaction } from '../../models';
import { findUserChat } from './helpers/findChat';

export default async function getChatMessages(
    request: Request<{ chatId: string; from?: Date; limit?: number }>,
    response: Response
) {
    const { chatId, from, limit } = request.params;
    await findUserChat(request.user, chatId);

    const dbMessages = await Message.findAll({
        where: {
            chatId,
            ...(from ? { createdAt: { [Sequelize.Op.lt]: from } } : {}),
            deathTime: {
                [Sequelize.Op.or]: [
                    null,
                    {
                        [Sequelize.Op.gt]: new Date()
                    }
                ]
            }
        },
        order: [['createdAt', 'DESC']],
        limit: limit || 30,
        include: [Reaction]
    });

    const messages = dbMessages
        .map(message => ({
            ...message.dataValues,
            timeToDeath: message.deathTime
                ? (message.deathTime.getTime() - new Date().getTimezoneOffset()*60*1000) - new Date().getTime()
                : null
        }));

    response.success(messages.reverse());
}
