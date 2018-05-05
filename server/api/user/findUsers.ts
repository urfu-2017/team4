import { sequelize } from '../../sequelize';

import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { User } from '../../models';

export default async function findUsers(
    request: Request<{ username: string }>,
    response: Response
) {
    const escapedUsername = request.params.username.replace(/(_|%|\\)/g, '\\$1');
    const likeQuery = sequelize.escape(`%${escapedUsername}%`);
    response.success(
        await User.findAll({
            where: {
                username: {
                    // FIXME iLike для Postgres
                    [sequelize.Op.like]: sequelize.literal(`${likeQuery} ESCAPE '\\'`)
                }
            }
        })
    );
}
