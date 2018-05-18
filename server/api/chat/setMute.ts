import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Members } from '../../models';

interface Params {
    chatId: string;
    mute: boolean;
}

export default async function setMute(request: Request<Params>, response: Response) {
    const memberRecord = await Members.findOne({
        where: {
            userId: request.user,
            chatId: request.params.chatId
        }
    });

    if (!memberRecord) {
        return response.error(403, 'Permission denied');
    }

    memberRecord.mute = request.params.mute;

    await memberRecord.save();

    response.success(memberRecord.mute);
}
