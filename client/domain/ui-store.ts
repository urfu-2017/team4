import { action, computed, observable, runInAction } from 'mobx';
import UserModel from './user-model';

const TIMEOUT_ERROR = 5000;

class UIStore {
    @observable
    public userInfo: UserModel = null;

    @observable
    public isMenuShown: boolean = false;

    @observable
    public error = null;

    @observable
    public popupStack = [];

    @observable
    public displays = {
        contacts: false,
        profile: false,
        chatInfo: false,
        userInfo: false,
        createRoom: false
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
        this.isMenuShown = !this.isMenuShown;
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
    public toggleUserInfoPopup(user: UserModel) {
        if (user) {
            this.userInfo = user;
            this.displays.userInfo = true;
        } else {
            this.userInfo = null;
            this.displays.userInfo = false;
        }

        this.isMenuShown = false;
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
