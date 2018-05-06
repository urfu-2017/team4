import { action, observable } from 'mobx';

import RPC from '../utils/rpc-client';
import UserModel from './user-model';
import { Events } from '../../shared/events';

class UsersStore {
    @observable
    public currentUser = null;

    @observable
    public users: Map<number, UserModel> = new Map();

    public constructor() {
        RPC.addListener(Events.UPDATE_PROFILE, this.onProfileUpdate);
    }

    public async fetchUser(userId): Promise<UserModel> {
        if (this.users.has(userId)) {
            return this.users.get(userId);
        }

        const userModel = new UserModel(userId);
        this.users.set(userId, userModel);
        await userModel.fetch();

        return userModel;
    }

    public async fetchUserByUsername(username) {
        username = username.toLowerCase();

        const savedUser = Array.from(this.users.values())
            .find(user => user.username.toLowerCase() === username);
        if (savedUser) {
            return savedUser;
        }

        const users = await RPC.request('findUsers', { username });
        const newUser = users.find(user => user.username.toLowerCase() === username);
        if (!newUser) {
            return null;
        }
        return this.saveUser(newUser);
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
        const userModel = this.users.get(user.id);

        userModel.update(user);
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

    @action
    private onProfileUpdate = (update: UserModel) => {
        const user = this.users.get(update.id);

        if (user) {
            user.firstName = update.firstName;
            user.lastName = update.lastName;
            user.bio = update.bio;
            user.avatar = update.avatar;
        }
    }
}

export default new UsersStore();
