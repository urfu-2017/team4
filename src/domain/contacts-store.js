import { observable, action, computed } from 'mobx';

import RPC from '../utils/rpc-client';

class ContactsStore {
    @observable list = undefined;
    @observable filterValue = '';
    @observable state = 'loading';

    @computed get filteredList() {
        if (!this.filterValue) {
            return this.list;
        }

        const filterValue = new RegExp(this.filterValue, 'i');

        return this.list.filter(({ username, firstName, lastName }) =>
            [username, firstName, lastName].some(word => word && word.match(filterValue))
        );
    }

    @action setFilterValue(value) {
        this.filterValue = value;
    }

    @action async loadList() {
        this.list = await RPC.request('fetchContacts');
        this.state = this.list.length ? 'loaded' : 'empty';
    }

    @action async add(user) {
        const { username } = user;

        if (username) {
            const contact = await RPC.request('addContact', { username });
            this.list.push(contact);
        }
    }

    has(login) {
        return Boolean(this.list.find(user => user.login === login));
    }
}

export default new ContactsStore();
