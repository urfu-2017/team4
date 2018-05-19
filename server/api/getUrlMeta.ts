import * as got from 'got';
import * as metascraper from 'metascraper';
import * as htmlToUtf8 from 'html-to-utf8';

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

    const { body, headers, url: responseUrl } = await got(url, { encoding: null });
    const html = htmlToUtf8(body, headers['content-type']);

    const meta = await metascraper({ html, url: responseUrl });

    response.success(meta);
}
