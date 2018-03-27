'use strict';

const querystring = require('querystring');
const got = require('got');

const DB_URL = 'https://hrudb.herokuapp.com/storage/';
const DEFAULT_RETRIES_COUNT = 5;
const REQUEST_TIMEOUT = 2000;

class DbError extends Error {
}

class DbClient {
    constructor(token) {
        this._token = token;
    }

    put(key, value, retries = DEFAULT_RETRIES_COUNT) {
        return DbClient._try(() => this._put(key, value), retries);
    }

    post(key, value, retries = DEFAULT_RETRIES_COUNT) {
        return DbClient._try(() => this._post(key, value), retries);
    }

    get(key, retries = DEFAULT_RETRIES_COUNT) {
        return DbClient._try(() => this._get(key), retries);
    }

    getAll(key, options, retries = DEFAULT_RETRIES_COUNT) {
        return DbClient._try(() => this._getAll(key, options), retries);
    }

    del(key, retries = DEFAULT_RETRIES_COUNT) {
        return DbClient._try(() => this._del(key), retries);
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
            return await got(DB_URL + path, {
                method,
                headers: {
                    authorization: this._token,
                    'content-type': 'plain/text'
                },
                body: body ? JSON.stringify(body) : undefined,
                throwHttpErrors: false,
                timeout: REQUEST_TIMEOUT
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
            options[field] = options[field].getDate();
        }
    }

    static async _try(method, retries) {
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

module.exports = { DbClient, DbError };
