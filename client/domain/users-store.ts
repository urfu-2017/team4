import { action, observable } from 'mobx';

import RPC from '../utils/rpc-client';
import UserModel from './user-model';

class UsersStore {
    @observable public currentUser = null;

    @observable.shallow public users: Map<string, UserModel> = new Map();

    public async fetchUser(userId) {
        if (this.users.has(userId)) {
            return;
        }

        const userModel = new UserModel(userId);
        this.users.set(userId, userModel);
        await userModel.fetch();
    }

    public saveUser(userFromJson, force: boolean = false): UserModel {
        if (this.users.has(userFromJson.id) && !force) {
            return this.users.get(userFromJson.id);
        }

        const userModel = UserModel.fromJSON(userFromJson);
        this.users.set(userModel.id, userModel);
        RPC.request('subscribeToUser', { userId: userFromJson.id });

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
        // await RPC.request('logout');
        this.clear();
    }
}

export default new UsersStore();
