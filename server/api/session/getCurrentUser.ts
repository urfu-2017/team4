import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Chat, User } from '../../models';

export default async function getCurrentUser(request: Request<void>, response: Response) {
    const user = await User.findById(request.user, {
        include: [
            {
                model: User,
                through: { attributes: [] }
            },
            {
                model: Chat,
                include: [
                    {
                        model: User,
                        through: { attributes: [] }
                    }
                ],
                through: { attributes: [] }
            }
        ]
    });

    if (!user) {
        return response.error(404, 'User not found');
    }

    response.success(user);
}
