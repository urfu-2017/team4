import { Sequelize } from 'sequelize-typescript';

import { User } from './user';
import { Chat } from './chat';
import { Contacts } from './contacts';
import { Members } from './members';
import { Message } from './message';
import { Reaction } from './reaction';

async function configureModels(sequilize: Sequelize) {
    sequilize.addModels([User, Chat, Message, Members, Contacts, Reaction]);
    await sequilize.sync({ force: true });
}

export { User, Contacts, Chat, Members, Message, Reaction, configureModels };
