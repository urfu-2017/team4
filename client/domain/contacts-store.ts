import { action, computed, observable, runInAction } from 'mobx';

import RPC from '../utils/rpc-client';

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
    public async loadList() {
        try {
            const list = await RPC.request('fetchContacts');
            runInAction(() => {
                this.list = list;
                this.state = this.list.length ? 'loaded' : 'empty';
            });
        } catch (e) {
            runInAction(() => {
                this.state = 'error';
            });
        }
    }

    @action
    public async add(user) {
        const { username } = user;
        if (!username) {
            return;
        }

        try {
            const contact = await RPC.request('addContact', { username });
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
