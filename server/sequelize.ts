import { Sequelize } from 'sequelize-typescript';
import { POSTGRES } from './config';

const { HOST, PORT, USERNAME, PASSWORD, DATABASE } = POSTGRES;
export const sequelize = new Sequelize(
    `postgres://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}`
);
