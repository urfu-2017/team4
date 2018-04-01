import { observable, action, computed } from 'mobx';

class ContactsStore {
    @observable list = undefined;
    @observable filterValue = '';

    @computed get isLoaded() {
        return Boolean(this.list);
    }

    @computed get isEmpty() {
        return !this.list || !this.list.length;
    }

    @computed get filteredList() {
        if (!this.filterValue) {
            return this.list;
        }

        const filterValue = new RegExp(this.filterValue, 'i');

        return this.list.filter(({ name, login }) => (
            name.split(' ').some(word => word.match(filterValue)) ||
            login.match(filterValue)
        ));
    }

    @action setFilterValue(value) {
        this.filterValue = value;
    }

    @action loadList() {
        // TODO организовать загрузку

        setTimeout(() => {
            this.list = [
                {
                    name: 'Вася',
                    login: 'vasyan',
                    avatar: '/'
                },
                {
                    name: 'Петя',
                    login: 'petya',
                    avatar: '/'
                },
                {
                    name: 'Ваня',
                    login: 'vanya',
                    avatar: '/'
                },
                {
                    name: 'Саша',
                    login: 'sasha',
                    avatar: '/'
                }
            ];
        }, 2000);
    }
}

export default new ContactsStore();
