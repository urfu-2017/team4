import { Sequelize } from 'sequelize-typescript'

import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';
import { User } from '../../models/user';

export default async function findUsers(request: Request<{ username: string; }>, response: Response) {
    const query = request.params.username
        .replace(/(_|%|\\)/g, '\\$1');
    response.success(await User.findAll({
        where: {
            username: {
                // FIXME iLike для Postgres
                [Sequelize.Op.like]: `%${query}%`
            }
        }
    }));
}
