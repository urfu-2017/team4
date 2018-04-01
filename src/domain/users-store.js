import { observable, action } from 'mobx';
import RPC from '../utils/rpc-client';

class UsersStore {
    @observable currentUser = null;

    async fetchCurrentUser() {
        this.currentUser = await RPC.request('fetchUser');
    }

    @action
    clear() {
        this.currentUser = null;
    }
}

export default new UsersStore();
