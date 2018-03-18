'use strict';

const querystring = require('querystring');

const got = require('got');

const DB_URL = 'https://hrudb.herokuapp.com/storage/';
const DEFAULT_RETRIES_COUNT = 2;
const REQUEST_TIMEOUT = 2000;

class DbError extends Error {
}

class DbClient {
    constructor(token) {
        this._token = token;
    }

    async put(key, value, retries = DEFAULT_RETRIES_COUNT) {
        return await DbClient._try(() => this._put(key, value), retries);
    }

    async post(key, value, retries = DEFAULT_RETRIES_COUNT) {
        return await DbClient._try(() => this._post(key, value), retries);
    }

    async get(key, retries = DEFAULT_RETRIES_COUNT) {
        return await DbClient._try(() => this._get(key), retries);
    }

    async getall(key, options, retries = DEFAULT_RETRIES_COUNT) {
        return await DbClient._try(() => this._getall(key, options), retries);
    }

    async del(key, retries = DEFAULT_RETRIES_COUNT) {
        return await DbClient._try(() => this._del(key), retries);
    }

    async _put(key, value) {
        let response = await this._request('PUT', key, value);
        DbClient._assertStatus(response, 201);
    }

    async _post(key, value) {
        let response = await this._request('POST', key, value);
        DbClient._assertStatus(response, 204);
    }

    async _get(key) {
        let response = await this._request('GET', key);
        DbClient._assertStatus(response, 204, 404);

        return response.statusCode === 200 ? JSON.parse(response.body) : null;
    }

    async _getall(key, options) {
        DbClient._convertDateField(options, 'from');
        DbClient._convertDateField(options, 'to');

        let path = key + '/all/?' + querystring.stringify(options);

        let response = await this._request('GET', path);
        DbClient._assertStatus(response, 200);

        return JSON.parse(response.body);
    }

    async _del(key) {
        let response = await this._request('DELETE', key);
        DbClient._assertStatus(response, 204);
    }

    async _request(method, path, body) {
        try {
            return await got(DB_URL + path, {
                method,
                headers: {
                    'authorization': this._token,
                    'content-type': 'plain/text'
                },
                body,
                throwHttpErrors: false,
                timeout: REQUEST_TIMEOUT
            });
        } catch (e) {
            throw new DbError(e.message);
        }
    }

    static _assertStatus(response, ...allowedStatuses) {
        if (!allowedStatuses.includes(response.statusCode)) {
            throw new DbError('Unexpected HTTP status: ' + response.statusCode);
        }
    }

    static _convertDateField(options, field) {
        if (options && options[field] && options[field] instanceof Date) {
            options[field] = options[field].getDate();
        }
    }

    static async _try(method, retries) {
        for (let retry = 1; retry <= retries; retry++) {
            try {
                return await method();
            } catch (e) {
                if (e instanceof DbError && retry !== retries) {
                    continue;
                }
                throw e;
            }
        }
    }
}

module.exports = {DbClient, DbError};