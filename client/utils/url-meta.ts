import RPC from './rpc-client';

const cache = new Map();

export default async function(url: string, messageId: string) {
    let meta = cache.get(`${url}_${messageId}`);

    if (meta) {
        return meta;
    }

    meta = await RPC.request('getUrlMeta', { url });
    cache.set(`${url}_${messageId}`, meta);

    return meta;
}
