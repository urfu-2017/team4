import { observable, runInAction } from 'mobx';

import RPC from '../utils/rpc-client';
import usersStore from './users-store';
import contactsStore from './contacts-store';
import chatsStore from './chats-store';

class ApplicationStore {

    @observable
    public isAppLoaded = false;

    @observable
    public isAuthRequired = false;

    public async init() {
        try {
            await RPC.connect();
            const { chats, contacts,...currentUser } = await RPC.request('getCurrentUser');

            runInAction(() => {
                usersStore.currentUser = usersStore.saveUser(currentUser);
                contactsStore.setList(contacts.map(contact => usersStore.saveUser(contact)));
                chats.forEach(chat => chatsStore.saveChat(chat));
                this.isAppLoaded = true;
            });
        } catch (e) {
            console.error(e);
            this.isAuthRequired = true;
            this.isAppLoaded = true;
        }
    }
}

export default new ApplicationStore();
