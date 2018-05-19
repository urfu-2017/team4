import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { Chat, User } from '../../models';

export default async function getCurrentUser(request: Request<void>, response: Response) {
    // @ts-ignore
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
                through: { as: 'memberData' }
            }
        ]
    });

    if (!user) {
        return response.error(404, 'User not found');
    }

    response.success(user);
}
