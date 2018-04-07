'use strict';

const RPC = require('../../utils/rpc');

module.exports = async (params, response) => {
    try {
        const { dialogs } = params;

        if (!dialogs || !Array.isArray(dialogs)) {
            return response.error(new RPC.Error('Invalid params'));
        }


        // eslint-disable-next-line no-restricted-syntax
        for (const dialogId of dialogs) {
            response.socket.join(dialogId);
        }

        return response.success(null);
    } catch (e) {
        return response.error(new RPC.Error('Internal error'));
    }
};
