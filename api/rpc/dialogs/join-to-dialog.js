'use strict';

module.exports = (params, response) => {
    const { dialog } = params;

    if (!dialog) {
        return;
    }

    response.socket.join(dialog);
    response.success(null);
};
