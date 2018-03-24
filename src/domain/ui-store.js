import { observable, computed, action, runInAction } from 'mobx';

const TIMEOUT_ERROR = 5000;

class UIStore {
    @observable error = null;

    @computed get hasError() {
        return this.error !== null;
    }

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

export default UIStore;
