import { observable, action } from 'mobx';
import RPC from '../utils/rpc-client';
import UserModel from './user-model';

class UsersStore {
    @observable currentUser = null;
    @observable.shallow users = new Map();

    async fetchCurrentUser() {
        const user = await RPC.request('fetchUser');
        const userModel = UserModel.fromJSON(user);

        this.users.set(userModel.username, userModel);
        this.currentUser = userModel;
    }

    async fetchUser(username) {
        if (this.users.has(username)) {
            return;
        }

        const userModel = new UserModel(username);
        this.users.set(username, userModel);
        userModel.fetch();
    }

    async saveCurrentUser(user) {
        await RPC.request('saveUser', user);

        const userModel = UserModel.fromJSON(user);
        this.users.set(userModel.username, userModel);
        this.currentUser = userModel;
    }

    @action clear() {
        this.currentUser = null;
    }

    async logout() {
        await RPC.request('logout');
        this.clear();
    }
}

export default new UsersStore();
