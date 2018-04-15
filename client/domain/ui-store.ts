import { action, computed, observable, runInAction } from 'mobx';

const TIMEOUT_ERROR = 5000;

class UIStore {
    @observable.ref public showProfile = null;

    @observable public menuShow = false;
    @observable public error = null;
    @observable public popupStack = [];
    @observable
    public displays = {
        contacts: false,
        profile: false,
        user: false
    };

    @computed
    get topPopup() {
        return this.popupStack[this.popupStack.length - 1] || null;
    }

    @computed
    get hasError() {
        return this.error !== null;
    }

    @action
    public toggleLeftPanel = () => {
        this.menuShow = !this.menuShow;
    };

    @action
    public pushPopup(popupName) {
        this.popupStack.push(popupName);
    }

    @action
    public popPopup() {
        this.popupStack.pop();
    }

    @action
    public togglePopup = name => () => {
        this.displays[name] = !this.displays[name];
    };

    @action
    public toggleUserProfilePopup(user) {
        if (user) {
            this.showProfile = user;
            this.displays.user = true;
        } else {
            this.showProfile = null;
            this.displays.user = false;
        }

        this.menuShow = false;
    }

    @action
    public showError(message) {
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
