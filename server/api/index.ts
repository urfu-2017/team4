import { RpcHandler } from '../rpc/server';

import hello from './echo';

export const getMethods = (): Record<string, RpcHandler> => ({
    hello
});
