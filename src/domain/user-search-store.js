import { observable, action, computed } from 'mobx';

import contactsStore from './contacts-store';

const userList = [
    {
        name: 'Вася',
        login: 'vasyan1',
        avatar: '/'
    },
    {
        name: 'Петя',
        login: 'petya1',
        avatar: '/'
    },
    {
        name: 'Ваня',
        login: 'vanya1',
        avatar: '/'
    },
    {
        name: 'Саша',
        login: 'sasha1',
        avatar: '/'
    }
];

class UserSearchStore {
    @observable user = undefined;
    @observable query = '';

    @computed get isFound() {
        return Boolean(this.user);
    }

    @computed get isLoaded() {
        return this.user !== undefined;
    }

    @computed get isAlreadyAdded() {
        return Boolean(contactsStore.list.find(user => user.login === this.query));
    }

    @action setQuery = (query) => {
        this.query = query;
    };

    @action searchUser = () => {
        if (!this.query) {
            return;
        }

        setTimeout(() => {
            this.user = userList.find(user => user.login === this.query) || null;
        }, 1000);
    };

    @action clear = () => {
        this.user = undefined;
        this.query = '';
    };
}

export default new UserSearchStore();
