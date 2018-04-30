import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { User, Chat } from '../../models/index';

export default async function getCurrentUser(request: Request<void>, response: Response) {
    const user = await User.findById(request.user,
        {
            include: [{
                model: User
            }, {
                model: Chat,
                include: {
                    model: User
                }
            }]
        });
    if (!user) {
        return response.error(404, 'User not found');
    }
    response.success(user);
}
