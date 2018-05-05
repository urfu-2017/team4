import { Sequelize } from 'sequelize-typescript';
import { POSTGRES, isDevelopment } from './config';

export let sequelize;

if (isDevelopment) {
    sequelize = new Sequelize({
        database: 'k1logram',
        dialect: 'sqlite',
        username: 'root',
        password: '',
        storage: ':memory:',
        logging: false
    });
} else {
    const { HOST, PORT, USERNAME, PASSWORD, DATABASE } = POSTGRES;
    sequelize = new Sequelize(`postgres://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}`);
}
