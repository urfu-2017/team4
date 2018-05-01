import { action, computed, observable, runInAction } from 'mobx';

import RPC from '../utils/rpc-client';
import contactsStore from './contacts-store';
import UserModel from './user-model';

class UserSearchStore {
    @observable
    public users = [];

    @observable
    public state = 'initial';

    @observable
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
        const users = await RPC.request('findUsers', { username: this.query });

        // Вызываем только если ожидаем результат
        if (this.state === 'loading') {
            runInAction(() => {
                this.users = users.map(user => UserModel.fromJSON(user));
                this.state = this.users.length !== 0 ? 'loaded' : 'notFound';
            });
        }
    };

    @action
    public clear = () => {
        this.users = [];
        this.state = 'initial';
        this.query = '';
    };
}

export default new UserSearchStore();
