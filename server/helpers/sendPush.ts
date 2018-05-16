import { Members, Message } from '../models';
import { Server } from '../rpc/server';

export default async function(message: Message, currentUserId: number, server: Server) {
    // try {
    //     const members = await Members.find({
    //         where: { chatId: message.chatId },
    //         attributes: ['userId']
    //     }).toJSON() as any[];
    //
    //     console.info(members);
    // } catch (e) {
    //     console.info('Cannot send push');
    // }
    console.info('send push');
}
