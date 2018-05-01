import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize({
    database: 'k1logram',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: ':memory:',
    logging: false
});
