import { action, observable } from 'mobx';

import RPC from '../utils/rpc-client';
import usersStore from './users-store';
import contactsStore from './contacts-store';
import chatsStore from './chats-store';
import uiStore from './ui-store';

import sendToken from '../utils/sendToken';

class ApplicationStore {
    @observable public isAppLoaded = false;
    @observable public isAuthRequired = false;
    @observable public isOffline = !navigator.onLine;

    public constructor() {
        window.addEventListener('offline', () => this.setOffline(true));
        window.addEventListener('online', () =>
            setTimeout(() => this.init(), 1500)
        );
    }

    public async init() {
        try {
            const isOffline = this.isOffline;

            await RPC.connect();
            const { chats, contacts, ...currentUser } = await RPC.request('getCurrentUser', {}, 10000);

            usersStore.setCurrentUser(usersStore.saveUser(currentUser, isOffline));
            contactsStore.setList(contacts.map(contact => usersStore.saveUser(contact, isOffline)));
            await Promise.all(chats.map(chat => chatsStore.saveChat(chat, isOffline)));
            sendToken();

            this.setOffline(false);
            this.setLoaded({ requireAuth: false });
        } catch (error) {
            if (error.message === 'AUTH_ERROR') {
                this.saveRedirect(location.hash.slice(1));
                this.setLoaded({ requireAuth: true });
                return;
            }

            console.error(error);
            uiStore.setToast('Произошла критическая ошибка. Приложение будет перезагружено');
            setTimeout(() => window.location.reload(true), 3000);
        }
    }

    private saveRedirect(url: string) {
        try {
            localStorage.setItem('redirect', url);
        } catch (e) {
            // ignored
        }
    }

    @action
    private setLoaded({ requireAuth }: { requireAuth: boolean }) {
        this.isAppLoaded = true;
        this.isAuthRequired = requireAuth;
    }

    @action
    private setOffline(offline: boolean) {
        if (offline) {
            RPC.disconnect(false);
        }

        this.isOffline = offline;
    }
}

export default new ApplicationStore();
