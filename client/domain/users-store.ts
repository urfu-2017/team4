import { action, observable } from 'mobx';
import RPC from '../utils/rpc-client';
import UserModel from './user-model';

class UsersStore {
    @observable public currentUser = null;
    @observable.shallow public users = new Map();

    public async fetchCurrentUser() {
        const user = await RPC.request('getCurrentUser');
        this.currentUser = this.saveUser(user);
    }

    public async fetchUser(userId) {
        if (this.users.has(userId)) {
            return;
        }

        const userModel = new UserModel(userId);
        this.users.set(userId, userModel);
        await userModel.fetch();
    }

    public saveUser(userFromJson): UserModel {
        const userModel = UserModel.fromJSON(userFromJson);
        this.users.set(userModel.id, userModel);
        return userModel;
    }

    public async updateCurrentUser(user) {
        await RPC.request('updateCurrentUser', { user });

        const userModel = UserModel.fromJSON(user);
        this.users.set(userModel.id, userModel);
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
