import { action, observable, runInAction } from 'mobx';
import RPC from '../utils/rpc-client';

class UserModel {
    @observable isFetching = false;

    @observable.ref firstName;
    @observable.ref lastName;
    @observable.ref bio;

    constructor(username) {
        this.username = username;
    }

    get displayName() {
        const name = `${this.firstName || ''} ${this.lastName || ''}`.trim();
        return name || this.username;
    }

    @action
    async fetch() {
        if (this.isFetching) {
            return;
        }

        this.isFetching = true;
        try {
            const user = await RPC.request('fetchUser', { username: this.username });

            runInAction(() => {
                this.firstName = user.firstName;
                this.lastName = user.lastName;
                this.avatar = user.avatar;
                this.bio = user.bio;
            });
        } finally {
            runInAction(() => {
                this.isFetching = false;
            });
        }
    }

    static fromJSON({ username, firstName, lastName, avatar, bio }) {
        const userModel = new UserModel(username);

        userModel.firstName = firstName;
        userModel.lastName = lastName;
        userModel.avatar = avatar;
        userModel.bio = bio;

        return userModel;
    }
}

export default UserModel;
