const isDevelopment = process.env.NODE_ENV === 'development';

// eslint-disable-next-line import/prefer-default-export
export const AUTH_URL = isDevelopment ?
    'http://localhost:8080/auth' : 'http://k1logram.now.sh/auth';
