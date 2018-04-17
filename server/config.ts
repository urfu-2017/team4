import { config } from 'dotenv';

config();

const isDevelopment = process.env.NODE_ENV === 'development';
const frontendHostProd = 'https://k1logram.now.sh';
const backendHostProd = 'https://k1logram.now.sh';

const frontendHostDev = 'http://localhost:8080';
const backendHostDev = 'http://localhost:8080';

export const SERVER_PORT = 8080;
export const NODE_ENV = process.env.NODE_ENV!;
export const SECRET_KEY = process.env.SECRET_KEY!;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
export const AUTH_REDIRECT_URL = isDevelopment ? frontendHostDev : frontendHostProd;
export const GITHUB_AUTH_CALLBACK = isDevelopment
    ? `${backendHostDev}/auth/callback`
    : `${backendHostProd}/auth/callback`;
