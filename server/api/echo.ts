import { Request } from '../rpc/request';
import { Response } from '../rpc/response';

/**
 * Возвращает сообщение 'Hello, {userId}'
 */
export default async function(request: Request<void>, response: Response) {
    response.success(`Hello, ${request.user}`);
}
