import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { User } from '../../models/user';

export default async function getUserInfo(request: Request<{ userId: string, subscribe?: boolean }>, response: Response) {
    const user = await User.findById(request.params.userId);
    if (!user) {
        return response.error(404, 'User not found');
    }
    if (request.params.subscribe) {
        request.server.subcribeUser(request.user, `profile_${user.id}`);
    }
    response.success(user);
}
