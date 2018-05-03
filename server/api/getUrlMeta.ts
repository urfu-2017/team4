import * as got from 'got';
import * as metascraper from 'metascraper';

import { Request } from '../rpc/request';
import { Response } from '../rpc/response';
import { JsonRpcError } from 'jsonrpc-lite';

interface Params {
    url: string;
}

export default async function(request: Request<Params>, response: Response) {
    const { url } = request.params;

    if (!url) {
        throw JsonRpcError.invalidParams('url is empty');
    }

    const htmlResponse = await got(url);
    const meta = await metascraper({ html: htmlResponse.body, url: htmlResponse.url });

    response.success(meta);
}
