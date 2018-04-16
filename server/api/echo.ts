import { Request } from '../rpc/request';
import { Response } from '../rpc/response';

/**
 * Всегда отвечает присланным запросом
 */
export default async function(request: Request, response: Response) {
    response.success(request.raw);
}
