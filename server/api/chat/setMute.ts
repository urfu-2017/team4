import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Members } from '../../models';
import { Events } from '../../../shared/events';

interface Params {
    chatId: string;
    mute: boolean;
}

export default async function setMute(request: Request<Params>, response: Response) {
    const { chatId } = request.params;

    const memberRecord = await Members.findOne({
        where: {
            userId: request.user,
            chatId
        }
    });

    if (!memberRecord) {
        return response.error(403, 'Permission denied');
    }

    memberRecord.mute = request.params.mute;

    await memberRecord.save();

    response.notification(chatId, Events.MUTE_CHANGED, {
        chatId,
        mute: memberRecord.mute
    });
    response.success(memberRecord.mute);
}
