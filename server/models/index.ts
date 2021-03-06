import { Sequelize } from 'sequelize-typescript';

import { User } from './user';
import { Chat } from './chat';
import { Contacts } from './contacts';
import { Members } from './members';
import { Message } from './message';
import { Reaction } from './reaction';
import { Token } from './Token';

async function configureModels(sequilize: Sequelize) {
    sequilize.addModels([User, Chat, Message, Members, Contacts, Reaction, Token]);
    await sequilize.sync();
}

export { User, Contacts, Chat, Members, Message, Reaction, Token, configureModels };
