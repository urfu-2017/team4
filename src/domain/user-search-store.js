import { observable, action, computed } from 'mobx';

import contactsStore from './contacts-store';
import userList from '../fixtures/userList.json';

class UserSearchStore {
    @observable user = undefined;
    @observable state = 'initial';
    query = '';

    @computed get hasError() {
        return this.state === 'notFound' || this.state === 'collision';
    }

    @action setQuery = (query) => {
        if (typeof query === 'string') {
            this.query = query;
            this.state = contactsStore.has(query) ? 'collision' : this.state;
        }
    };

    @action searchUser = () => {
        if (!this.query || this.state === 'collision') {
            return;
        }

        this.state = 'loading';
        setTimeout(action('userLoaded', () => {
            this.user = userList.find(user => user.login === this.query) || null;
            this.state = this.user ? 'loaded' : 'notFound';
        }), 1000);
    };

    @action clear = () => {
        this.user = undefined;
        this.state = 'initial';
        this.query = '';
    };
}

export default new UserSearchStore();
