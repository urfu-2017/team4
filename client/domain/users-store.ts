import { action, observable } from 'mobx';
import RPC from '../utils/rpc-client';
import UserModel from './user-model';

class UsersStore {
    @observable public currentUser = null;
    @observable.shallow public users = new Map();

    public async fetchCurrentUser() {
        const user = await RPC.request('fetchUser');
        const userModel = UserModel.fromJSON(user);

        this.users.set(userModel.username, userModel);
        this.currentUser = userModel;
    }

    public async fetchUser(username) {
        if (this.users.has(username)) {
            return;
        }

        const userModel = new UserModel(username);
        this.users.set(username, userModel);
        userModel.fetch();
    }

    public async saveCurrentUser(user) {
        await RPC.request('saveUser', user);

        const userModel = UserModel.fromJSON(user);
        this.users.set(userModel.username, userModel);
        this.currentUser = userModel;
    }

    @action
    public clear() {
        this.currentUser = null;
    }

    public async logout() {
        await RPC.request('logout');
        this.clear();
    }
}

export default new UsersStore();
