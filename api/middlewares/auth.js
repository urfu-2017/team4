'use strict';

module.exports = (req, res, next) => {
    if (req.path.startsWith('/api') && (!req.session || !req.session.authenticated)) {
        return res.sendStatus(401);
    }

    next();
};
