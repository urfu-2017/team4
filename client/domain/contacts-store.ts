import { action, computed, observable, runInAction } from 'mobx';

import RPC from '../utils/rpc-client';
import UsersStore from './users-store'

class ContactsStore {
    @observable public list = [];
    @observable public filterValue = '';
    @observable public state = 'loading';

    @computed
    get filteredList() {
        if (!this.filterValue) {
            return this.list;
        }

        return this.list.filter(({ username, firstName, lastName }) =>
            [username, firstName, lastName].some(
                word => word && word.toLowerCase().indexOf(this.filterValue) !== -1
            )
        );
    }

    @action
    public setFilterValue(value) {
        this.filterValue = value.toLowerCase();
    }

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
                this.list.push(contact);
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
