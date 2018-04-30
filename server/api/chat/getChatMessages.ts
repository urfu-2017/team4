import { Sequelize } from 'sequelize-typescript'

import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Message } from '../../models/index';
import findChat from './findChat';

export default async function getChatMessages(request: Request<{ chatId: string; from?: Date, limit?: number }>, response: Response) {
    const {chatId, from, limit} = request.params;
    const chat = await findChat(request.user, chatId);

    const messages = await Message.findAll({
        where: {
            chatId,
            ...(from ? {createdAt: {[Sequelize.Op.lt]: from} } : {})
        },
        order: [['createdAt', 'DESC']],
        limit: limit || 30
    });
    response.success(messages.reverse());
}
