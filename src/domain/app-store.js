import { observable, action } from 'mobx';

class AppStore {
    @observable displayAddContact = false;

    @action toggleAddContact = () => {
        this.displayAddContact = !this.displayAddContact;
    }
}

export default new AppStore();
