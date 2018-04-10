import { observable, computed, action, runInAction } from 'mobx';

const TIMEOUT_ERROR = 5000;

class UIStore {
    @observable error = null;
    @observable displayContacts = false;
    @observable displayProfile = false;

    @computed get hasError() {
        return this.error !== null;
    }

    @action toggleContacts = () => {
        this.displayContacts = !this.displayContacts;
    };

    @action toggleProfile = () => {
        this.displayProfile = !this.displayProfile;
    };

    @action
    showError(message) {
        this.error = message;
        setTimeout(
            runInAction(() => {
                this.error = null;
            }),
            TIMEOUT_ERROR
        );
    }
}

export default new UIStore();
