import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';

export default function (request: Request<void>, response: Response) {
    console.info('logout', request.user);
    request.server.logout(request.user);
    response.success(true);
}
