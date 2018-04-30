import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize({
    database: 'test-db',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: ':memory:',
    logging: false
});
