import * as path from 'path';
import { config } from 'dotenv';

config();

const isDevelopment = process.env.NODE_ENV === 'development';
const frontendHostProd = 'http://kilogram.online:4000';
const backendHostProd = 'http://kilogram.online:4000';

const frontendHostDev = 'http://localhost:3000';
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
export const UPLOADS_SERVER_PATH = path.resolve(__dirname, 'static/uploads');
export const UPLOADS_URL_PATH = '/uploads';

export const WEATHER_API_TOKEN = process.env.WEATHER_API_TOKEN;

export const POSTGRES = {
    HOST: process.env.POSTGRES_HOST!,
    PORT: process.env.POSTGRES_PORT!,
    USERNAME: process.env.POSTGRES_USERNAME!,
    PASSWORD: process.env.POSTGRES_PASSWORD!,
    DATABASE: process.env.POSTGRES_DATABASE!
};
