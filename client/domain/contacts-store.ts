import { action, observable, runInAction } from 'mobx';

import RPC from '../utils/rpc-client';
import usersStore from './users-store';

class ContactsStore {
    @observable public list = [];
    @observable public state = 'loading';

    @action
    public setList(contacts) {
        this.list = contacts;
        this.state = this.list.length ? 'loaded' : 'empty';
    }

    @action
    public async add(user) {
        if (!user.id) {
            return;
        }

        try {
            const contact = await RPC.request('addContact', { contactId: user.id });
            runInAction(() => {
                this.list.push(usersStore.saveUser(contact));
                this.state = 'loaded';
            });
        } catch (e) {
            console.error(e.message);
        }
    }

    public has(username) {
        return Boolean(this.list.find(user => user.username === username));
    }
}

export default new ContactsStore();
