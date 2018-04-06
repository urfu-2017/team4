import { observable, action, computed } from 'mobx';

import contactList from '../fixtures/contactList.json';

class ContactsStore {
    @observable list = undefined;
    @observable filterValue = '';
    @observable state = 'loading';

    @computed get filteredList() {
        if (!this.filterValue) {
            return this.list;
        }

        const filterValue = new RegExp(this.filterValue, 'i');

        return this.list.filter(({ name, login }) => (
            name.split(' ').some(word => word.match(filterValue)) ||
            login.match(filterValue)
        ));
    }

    @action setFilterValue(value) {
        this.filterValue = value;
    }

    @action loadList() {
        setTimeout(action(() => {
            this.list = contactList;
            this.state = this.list.length ? 'loaded' : 'empty';
        }), 100);
    }

    @action add(user) {
        const { name, login, avatar } = user;

        if (name && login && avatar) {
            this.list.push(user);
        }
    }

    has(login) {
        return Boolean(this.list.find(user => user.login === login));
    }
}

export default new ContactsStore();
