import { observable, action, runInAction } from 'mobx';
import RPC from '../utils/rpc-client';

class UsersStore {
    @observable currentUser = null;

    @action
    async fetchCurrentUser() {
        const currentUser = await RPC.request('fetchUser');
        runInAction(() => {
            this.currentUser = currentUser;
        });
    }

    @action
    clear() {
        this.currentUser = null;
    }
}

export default new UsersStore();
