import { action, observable } from 'mobx';

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

            usersStore.setCurrentUser(usersStore.saveUser(currentUser));
            contactsStore.setList(contacts.map(contact => usersStore.saveUser(contact)));
            await Promise.all(chats.map(chat => chatsStore.saveChat(chat)));

            this.setLoaded(false);
        } catch (e) {
            // TODO: Use logger
            console.error(e);
            this.setLoaded(true);
        }
    }

    @action
    private setLoaded(requireAuth: boolean) {
        this.isAppLoaded = true;
        this.isAuthRequired = requireAuth;
    }
}

export default new ApplicationStore();
