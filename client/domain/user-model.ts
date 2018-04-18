import { action, observable, runInAction } from 'mobx';
import RPC from '../utils/rpc-client';

class UserModel {
    public static fromJSON({ username, firstName, lastName, avatar, bio }) {
        const userModel = new UserModel(username);

        userModel.firstName = firstName;
        userModel.lastName = lastName;
        userModel.avatar = avatar;
        userModel.bio = bio;

        return userModel;
    }

    @observable public isFetching = false;

    @observable.ref public username: string;

    @observable.ref public firstName: string;

    @observable.ref public lastName: string;

    @observable.ref public bio: string;

    @observable.ref public avatar: string;

    constructor(username) {
        this.username = username;
    }

    get displayName() {
        const name = `${this.firstName || ''} ${this.lastName || ''}`.trim();
        return name || this.username;
    }

    @action
    public async fetch() {
        if (this.isFetching) {
            return;
        }

        this.isFetching = true;
        try {
            const user: any = await RPC.request('fetchUser', { username: this.username });

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
}

export default UserModel;
