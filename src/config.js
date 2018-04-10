const isDevelopment = process.env.NODE_ENV === 'development';

// eslint-disable-next-line import/prefer-default-export
export const AUTH_URL = isDevelopment ?
    'http://localhost:8080/auth' : 'https://k1logram.now.sh/auth';
//
export const WEB_SOCK_URL = isDevelopment ?
    'http://localhost:8080' : 'https://k1logram.now.sh';
