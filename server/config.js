'use strict';

require('dotenv').config();

const isDevelopment = process.env.NODE_ENV === 'development';
const frontendHostProd = 'https://k1logram.now.sh';
const frontendHostDev = 'http://localhost:3000';
const backendHostProd = 'https://k1logram.now.sh';
const backendHostDev = 'http://localhost:8080';

exports.SERVER_PORT = 8080;
exports.NODE_ENV = process.env.NODE_ENV;
exports.SECRET_KEY = process.env.SECRET_KEY;
exports.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
exports.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
exports.AUTH_REDIRECT_URL = isDevelopment ? frontendHostDev : frontendHostProd;
exports.GITHUB_AUTH_CALLBACK = isDevelopment
    ? `${backendHostDev}/auth/callback`
    : `${backendHostProd}/auth/callback`;

exports.HRUDB_TOKEN = process.env.HRUDB_TOKEN;
exports.HRUDB_URL = 'https://hrudb.herokuapp.com/storage/';
exports.HRUDB_RETRIES_COUNT = 20;
exports.HRUDB_REQUEST_TIMEOUT = 2000;
