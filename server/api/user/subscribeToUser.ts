import { Request } from '../../rpc/request';
import { Response } from '../../rpc/response';

export default async function(request: Request<{ userId: number }>, response: Response) {
    await request.server.subscribeUser(request.user, `profile_${request.params.userId}`);
    response.success(null);
}
