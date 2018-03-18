'use strict';

const querystring = require('querystring');

const got = require('got');

const DB_URL = 'https://hrudb.herokuapp.com/storage/';

class DbError extends Error {
}

class DbClient {
    constructor(token){
        this._token = token;
    }

    async put(key, value){
        let response = await this._request('PUT', key, value);
        DbClient._assertStatus(response, 201);
    }

    async post(key, value){
        let response = await this._request('POST', key, value);
        DbClient._assertStatus(response, 204);
    }

    async get(key){
        let response = await this._request('GET', key);
        DbClient._assertStatus(response, 204, 404);

        return response.statusCode === 200 ? JSON.parse(response.body) : null;
    }

    async getall(key, options){
        DbClient._convertDateField(options, 'from');
        DbClient._convertDateField(options, 'to');

        let path = key + '/all/?' + querystring.stringify(options);

        let response = await this._request('GET', path);
        DbClient._assertStatus(response, 200);

        return JSON.parse(response.body);
    }

    async del(key){
        let response = await this._request('DELETE', key);
        DbClient._assertStatus(response, 204);
    }

    async _request(method, path, body){
        try{
            return await got(DB_URL + path, {
                method,
                headers: {
                    'authorization': this._token,
                    'content-type': 'plain/text'
                },
                body,
                throwHttpErrors: false
            });
        } catch (e){
            throw new DbError(e.message);
        }
    }

    static _assertStatus(response, ...allowedStatuses) {
        if (!allowedStatuses.includes(response.statusCode)) {
            throw new DbError('Unexpected HTTP status: ' + response.statusCode);
        }
    }

    static _convertDateField(options, field){
        if (options && options[field] && options[field] instanceof Date){
            options[field] = options[field].getDate();
        }
    }
}

module.exports = { DbClient, DbError };