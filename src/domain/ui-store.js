import { observable, computed, action, runInAction } from 'mobx';

const TIMEOUT_ERROR = 5000;

class UIStore {
    @observable error = null;
    @observable popupStack = [];
    @observable displays = {
        contacts: false
    };

    @computed get topPopup() {
        return this.popupStack[this.popupStack.length - 1] || null;
    }

    @computed get hasError() {
        return this.error !== null;
    }

    @action pushPopup(popupName) {
        this.popupStack.push(popupName);
    }

    @action popPopup() {
        this.popupStack.pop();
    }

    @action togglePopup = name => (() => {
        this.displays[name] = !this.displays[name];
    });

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
