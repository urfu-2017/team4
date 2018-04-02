import { observable, action, computed } from 'mobx';

class UsersSearcher {
    @observable list = undefined;
    @observable query = '';

    @computed get isEmpty() {
        return !this.list || !this.list.length;
    }

    @computed get isLoaded() {
        return Boolean(this.list);
    }

    @action searchUsers(query) {
        if (typeof query !== 'string') {
            return;
        }

        setTimeout(() => {
            this.list = [
                {
                    name: 'Саша',
                    login: 'sasha',
                    avatar: '/'
                }
            ];
        }, 1000);
    }
}

export default new UsersSearcher();
