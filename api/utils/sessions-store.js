'use strict';

const { EventEmitter } = require('events');
const { Cookie, Session } = require('express-session');

const DB = require('../helpers/dbclient');

class SessionStore extends EventEmitter {
    get(sid, callback) {
        DB.get(DB.getKey('sessions', sid))
            .then(data => callback(null, data))
            .catch(error => callback(error));
    }

    set(sid, session, callback) {
        DB.put(DB.getKey('sessions', sid), session)
            .then(() => callback(null))
            .catch(error => callback(error));
    }

    destroy(sid, callback) {
        DB.del(DB.getKey('sessions', sid))
            .then(() => callback(null))
            .catch(error => callback(error));
    }

    /* eslint-disable no-param-reassign */
    createSession(req, session) {
        const { expires, originalMaxAge } = session.cookie;
        session.cookie = new Cookie(session.cookie);

        if (typeof expires === 'string') {
            session.cookie.expires = new Date(expires);
        }

        session.cookie.originalMaxAge = originalMaxAge;
        req.session = new Session(req, session);
        return req.session;
    }
    /* eslint-enable no-param-reassign */
}

module.exports = SessionStore;
