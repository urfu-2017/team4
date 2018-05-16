import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';

import { Token } from '../../models';

interface Params {
    token: string;
}

export default async function(request: Request<Params>, response: Response) {
    const { user: userId, params: { token } } = request;

    await Token.findOrCreate<Token>({
        where: { userId, token },
        defaults: { userId, token }
    });

    response.success(null);
}
