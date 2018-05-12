import { action, computed, observable } from 'mobx';
import UserModel from './user-model';

class UIStore {
    @observable public userInfo: UserModel = null;

    @observable public isMenuShown: boolean = false;

    @observable public popupStack = [];

    @observable public forwardMessage = null;
    @observable public isReplyForward = false;

    @observable
    public displays = {
        contacts: false,
        profile: false,
        chatInfo: false,
        userInfo: false,
        createRoom: false,
        selectChat: false,
    };

    @computed
    get topPopup() {
        return this.popupStack[this.popupStack.length - 1] || null;
    }

    @action
    public setForwardMessage(message: any, isReply: boolean = false) {
        this.forwardMessage = message;
        this.isReplyForward = message && isReply;
    }

    @action
    public closeAllPopups = () => {
        this.userInfo = null;
        Object.keys(this.displays).forEach(key => {
            this.displays[key] = false;
        });
    };

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

    public togglePopup = name =>
        action(() => {
            this.userInfo = null;
            this.displays[name] = !this.displays[name];
        });

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
}

export default new UIStore();
