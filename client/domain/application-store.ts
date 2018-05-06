import { observable, runInAction } from 'mobx';

import RPC from '../utils/rpc-client';
import usersStore from './users-store';
import contactsStore from './contacts-store';
import chatsStore from './chats-store';

class ApplicationStore {
    @observable public isAppLoaded = false;

    @observable public isAuthRequired = false;

    public async init() {
        try {
            await RPC.connect();
            const { chats, contacts, ...currentUser } = await RPC.request('getCurrentUser');

            runInAction(async () => {
                usersStore.currentUser = usersStore.saveUser(currentUser);
                contactsStore.setList(contacts.map(contact => usersStore.saveUser(contact)));
                await Promise.all(chats.map(chat => chatsStore.saveChat(chat)));
                this.isAppLoaded = true;
            });
        } catch (e) {
            this.isAuthRequired = true;
            this.isAppLoaded = true;
        }
    }
}

export default new ApplicationStore();
