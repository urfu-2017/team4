'use strict';

const querystring = require('querystring');
const got = require('got');
const {
    HRUDB_URL,
    HRUDB_TOKEN,
    HRUDB_REQUEST_TIMEOUT,
    HRUDB_RETRIES_COUNT
} = require('../config');

class DbError extends Error {
}

class DbClient {
    put(key, value, retries) {
        return DbClient._try(() => this._put(key, value), retries);
    }

    post(key, value, retries) {
        return DbClient._try(() => this._post(key, value), retries);
    }

    get(key, retries) {
        return DbClient._try(() => this._get(key), retries);
    }

    getAll(key, options, retries) {
        return DbClient._try(() => this._getAll(key, options), retries);
    }

    del(key, retries) {
        return DbClient._try(() => this._del(key), retries);
    }

    getKey(...parts) {
        return parts.join('_').toLowerCase();
    }

    async _put(key, value) {
        const response = await this._request('PUT', key, value);
        DbClient._assertStatus(response, 201);
    }

    async _post(key, value) {
        const response = await this._request('POST', key, value);
        DbClient._assertStatus(response, 204);
    }

    async _get(key) {
        const response = await this._request('GET', key);
        DbClient._assertStatus(response, 200, 404);

        return response.statusCode === 200 ? JSON.parse(response.body) : null;
    }

    async _getAll(key, options) {
        DbClient._convertDateField(options, 'from');
        DbClient._convertDateField(options, 'to');

        const path = `${key}/all/?${querystring.stringify(options)}`;

        const response = await this._request('GET', path);
        DbClient._assertStatus(response, 200);

        return JSON.parse(response.body).map(JSON.parse);
    }

    async _del(key) {
        const response = await this._request('DELETE', key);
        DbClient._assertStatus(response, 204);
    }

    async _request(method, path, body) {
        try {
            // Log requests
            console.info(method, path, JSON.stringify(body));

            return await got(HRUDB_URL + path, {
                method,
                headers: {
                    authorization: HRUDB_TOKEN,
                    'content-type': 'plain/text'
                },
                body: body && JSON.stringify(body),
                throwHttpErrors: false,
                timeout: HRUDB_REQUEST_TIMEOUT
            });
        } catch (e) {
            throw new DbError(e.message);
        }
    }

    static _assertStatus(response, ...allowedStatuses) {
        if (!allowedStatuses.includes(response.statusCode)) {
            throw new DbError(`Unexpected HTTP status: ${response.statusCode}`);
        }
    }

    static _convertDateField(options, field) {
        if (options && options[field] && options[field] instanceof Date) {
            // eslint-disable-next-line
            options[field] = options[field].getDate();
        }
    }

    static async _try(method, retries = HRUDB_RETRIES_COUNT) {
        let result;
        for (let retry = 1; retry <= retries; retry += 1) {
            try {
                result = await method(); /* eslint-disable-line */
                break;
            } catch (e) {
                if (retry === retries || !(e instanceof DbError)) {
                    throw e;
                }
            }
        }
        return result;
    }
}

module.exports = new DbClient();
exports.DbError = DbError;
