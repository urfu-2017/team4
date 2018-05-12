import { action, observable } from 'mobx';

import RPC from '../utils/rpc-client';
import usersStore from './users-store';
import contactsStore from './contacts-store';
import chatsStore from './chats-store';
import uiStore from './ui-store';

class ApplicationStore {
    @observable public isAppLoaded = false;
    @observable public isAuthRequired = false;
    @observable public isOffline = false;

    public constructor() {
        window.addEventListener('offline', () => this.setOffline(true));
        window.addEventListener('online', () => this.init());
    }

    public async init() {
        try {
            const isOffline = this.isOffline;

            await RPC.connect();
            const { chats, contacts, ...currentUser } = await RPC.request('getCurrentUser');

            usersStore.setCurrentUser(usersStore.saveUser(currentUser, isOffline));
            contactsStore.setList(contacts.map(contact => usersStore.saveUser(contact, isOffline)));
            await Promise.all(chats.map(chat => chatsStore.saveChat(chat, isOffline)));

            this.setOffline(false);
            this.setLoaded(false);
        } catch (error) {
            if (error.message === 'AUTH_ERROR') {
                this.setLoaded(true);
            }

            uiStore.setToast('Произошла критическая ошибка');
        }
    }

    @action
    private setLoaded(requireAuth: boolean) {
        this.isAppLoaded = true;
        this.isAuthRequired = requireAuth;
    }

    @action
    private setOffline(offline: boolean) {
        this.isOffline = offline;
    }
}

export default new ApplicationStore();
