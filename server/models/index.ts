import { Sequelize } from 'sequelize-typescript';

import { User } from './user';
import { UserContacts } from './user-contacts';

async function configureModels(sequilize: Sequelize) {
    sequilize.addModels([User, UserContacts]);
    await sequilize.sync({ force: true });
}

export { User, UserContacts, configureModels };
