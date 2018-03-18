'use strict';

const querystring = require('querystring');

const got = require('got');

const DB_URL = 'https://hrudb.herokuapp.com/storage/';

class DbError extends Error {
    constructor(response) {
        super(response.json().error.message);
    }
}

class DbClient {
    constructor(token){
        this._token = token;
    }

    async put(key, value){
        let response = await this._request('PUT', key, value);
        if (response.statusCode !== 201) {
            throw new DbError(response);
        }
    }

    async post(key, value){
        let response = this._request('POST', key, value);
        if (response.statusCode === 204) {
            throw new DbError(response);
        }
    }

    async get(key){
        let response = this._request('GET', key);
        if (response.statusCode === 400) {
            throw new DbError(response);
        }

        return response.statusCode === 200 ? response.json() : null;
    }

    async getall(key, from = '', to = '', sort, limit, offset){

        from = from instanceof Date ? from.getTime() : from;
        to = to instanceof Date ? to.getTime() : to;

        let path = key + '/all/?' + querystring.stringify({
            from, to, sort, limit, offset
        });

        let response = this._request('GET', path);
        if (response.statusCode === 400) {
            throw new DbError(response);
        }

        return response.statusCode === 200 ? response.json() : null;
    }

    async del(key, value){
        let response = this._request('GET', key, value);
        if (response.statusCode !== 204) {
            throw new DbError(response);
        }
    }

    _request(method, path, body){
        return got(DB_URL + path, {
            method,
            headers: {
                'authorization': this._token,
                'content-type': 'plain/text'
            },
            body
        });
    }
}