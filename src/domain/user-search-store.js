import { observable, action, computed, runInAction } from 'mobx';

import contactsStore from './contacts-store';
import RPC from '../utils/rpc-client';

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

    @action searchUser = async () => {
        if (!this.query || this.state === 'collision') {
            return;
        }

        this.state = 'loading';
        let user;

        try {
            user = await RPC.request('fetchUser', { username: this.query });
        } catch (e) {
            user = null;
        }

        runInAction(() => {
            this.user = user;
            this.state = this.user ? 'loaded' : 'notFound';
        });
    };

    @action clear = () => {
        this.user = undefined;
        this.state = 'initial';
        this.query = '';
    };
}

export default new UserSearchStore();
