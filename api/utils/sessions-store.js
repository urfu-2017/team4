'use strict';

const { EventEmitter } = require('events');
const { Cookie, Session } = require('express-session');

class SessionStore extends EventEmitter {
    /**
     * @param {DbClient} db
     */
    constructor(db) {
        super();

        this.db = db;
        this.key = 'sessions';
    }

    get(sid, callback) {
        this.db.get(`${this.key}_${sid}`)
            .then(data => callback(null, data))
            .catch(error => callback(error));
    }

    set(sid, session, callback) {
        this.db.put(`${this.key}_${sid}`, session)
            .then(() => callback(null))
            .catch(error => callback(error));
    }

    destroy(sid, callback) {
        this.db.del(`${this.key}_${sid}`)
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
