'use strict';

require('dotenv').config();

const isDevelopment = process.env.NODE_ENV === 'development';

exports.NODE_ENV = process.env.NODE_ENV;
exports.SECRET_KEY = process.env.SECRET_KEY;
exports.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
exports.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
exports.AUTH_REDIRECT_URL = isDevelopment ? 'http://localhost:3000/' : '/';
exports.GITHUB_AUTH_CALLBACK = isDevelopment ?
    'http://localhost:8080/auth/callback' : 'https://k1logram.now.sh/auth/callback';

exports.HRUDB_TOKEN = process.env.HRUDB_TOKEN;
exports.HRUDB_URL = 'https://hrudb.herokuapp.com/storage/';
exports.HRUDB_RETRIES_COUNT = 20;
exports.HRUDB_REQUEST_TIMEOUT = 2000;
