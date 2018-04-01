'use strict';

const { EventEmitter } = require('events');

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
}

module.exports = SessionStore;
