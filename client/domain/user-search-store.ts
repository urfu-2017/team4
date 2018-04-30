import { action, computed, observable, runInAction } from 'mobx';

import RPC from '../utils/rpc-client';
import contactsStore from './contacts-store';

class UserSearchStore {
    @observable public user = undefined;
    @observable public state = 'initial';
    public query = '';

    @computed
    get hasError() {
        return this.state === 'notFound' || this.state === 'collision';
    }

    @action
    public setQuery = query => {
        if (typeof query === 'string') {
            this.query = query;
            this.state = contactsStore.has(query) ? 'collision' : this.state;
        }
    };

    @action
    public searchUser = async () => {
        if (!this.query || this.state === 'collision') {
            return;
        }

        this.state = 'loading';
        let users;

        try {
            users = await RPC.request('findUsers', { username: this.query });
        } catch (e) {
            users = null;
        }

        // Вызываем только если ожидаем результат
        if (this.state === 'loading') {
            runInAction(() => {
                // FIXME несколько вариантов
                this.user = users[0];
                this.state = this.user ? 'loaded' : 'notFound';
            });
        }
    };

    @action
    public clear = () => {
        this.user = undefined;
        this.state = 'initial';
        this.query = '';
    };
}

export default new UserSearchStore();
