const isDevelopment = process.env.NODE_ENV === 'development';

export const BASE_URL = isDevelopment ?
    'http://localhost:8080' : 'http://kilogram.online:4000';

export const AUTH_URL = BASE_URL + '/auth'
export const WEB_SOCK_URL = BASE_URL + '/';
export const UPLOADS_URL = BASE_URL + '/upload';
