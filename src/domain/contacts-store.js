import { observable, action, computed } from 'mobx';

class MessageList {
    @observable list = undefined;

    @computed get isLoaded() {
        return Boolean(this.list);
    }

    @computed get isEmpty() {
        return !this.list || !this.list.length;
    }

    @action loadList() {
        // TODO организовать загрузку

        setTimeout(() => {
            this.list = [
                {
                    name: 'Вася',
                    login: 'vasyan',
                    avatar: '/',
                    id: 1
                },
                {
                    name: 'Вася',
                    login: 'vasyan',
                    avatar: '/',
                    id: 1
                },
                {
                    name: 'Вася',
                    login: 'vasyan',
                    avatar: '/',
                    id: 1
                },
                {
                    name: 'Вася',
                    login: 'vasyan',
                    avatar: '/',
                    id: 1
                },
                {
                    name: 'Вася',
                    login: 'vasyan',
                    avatar: '/',
                    id: 1
                },
                {
                    name: 'Вася',
                    login: 'vasyan',
                    avatar: '/',
                    id: 1
                },
                {
                    name: 'Вася',
                    login: 'vasyan',
                    avatar: '/',
                    id: 1
                },
                {
                    name: 'Вася',
                    login: 'vasyan',
                    avatar: '/',
                    id: 1
                }
            ];
        }, 1000);
    }
}

export default new MessageList();
