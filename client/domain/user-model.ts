import { action, observable, runInAction } from 'mobx';
import RPC from '../utils/rpc-client';

class UserModel {
    public static fromJSON({ id, username, firstName, lastName, avatar, bio }) {
        const userModel = new UserModel(id);

        userModel.username = username;
        userModel.firstName = firstName;
        userModel.lastName = lastName;
        userModel.avatar = avatar;
        userModel.bio = bio;

        return userModel;
    }

    @observable public isFetching = false;

    public id: number;

    public username: string;

    @observable public firstName: string;

    @observable public lastName: string;

    @observable public bio: string;

    @observable public avatar: string;

    constructor(userId) {
        this.id = userId;
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
            const user: any = await RPC.request('getUserInfo', {
                userId: this.id,
                subscribe: true
            });

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
