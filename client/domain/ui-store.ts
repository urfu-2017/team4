import { action, computed, observable } from 'mobx';
import UserModel from './user-model';

class UIStore {
    @observable public isDark: boolean = localStorage.isDark === 'true';
    @observable public userInfo: UserModel = null;

    @observable public isMenuShown: boolean = false;

    @observable public popupStack = [];

    @observable public forwardMessage = null;
    @observable public isReplyForward = false;

    @observable public error: string = '';

    // @observable public timeToDeath: number = null;
    // @observable public timeToDeathDay: number = 0;
    // @observable public timeToDeathHour: number = 0;
    // @observable public timeToDeathMin: number = 0;
    // @observable public timeToDeathState: boolean = false;    
    @observable
    public timeToDeath = {
        ms: null,
        state: false,
        min: 0,
        hour: 0,
        day: 0
    };

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
    public get topPopup() {
        return this.popupStack[this.popupStack.length - 1] || null;
    }

    private errorTimer: any;

    @action
    public toggleTheme = () => {
        this.isDark = !this.isDark;

        if (this.isDark) {
            document.body.style.backgroundColor = '#545b5f';
        } else {
            document.body.style.backgroundColor = '';
        }

        if(localStorage.isDark === undefined) {
            localStorage.isDark = this.isDark;

            return;
        }

        localStorage.isDark = localStorage.isDark === 'false';
    };

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

    @action
    public setToast(error: string, timeout = 3000) {
        this.error = error;
        clearTimeout(this.errorTimer);
        this.errorTimer = setTimeout(this.resetError, timeout + 400);
    }

    @action.bound
    public resetError() {
        clearTimeout(this.errorTimer);
        this.error = '';
    }

    @action
    public parsTimer() {
        const msInMin = 1000 * 60;
        const msInHour = msInMin * 60;
        const msInDays = msInHour * 24;
        this.timeToDeath.day = Math.floor(this.timeToDeath.ms / msInDays);
        const dayOst = this.timeToDeath.ms % msInDays;
        this.timeToDeath.hour = Math.floor(dayOst / msInHour);
        const hourOst = dayOst % msInHour;
        this.timeToDeath.min = Math.floor(hourOst / msInMin);
    }

    @action
    public getCookies() {
        if (this.getCookie('timeToDeath') !== undefined) {
            this.timeToDeath.ms = Number(this.getCookie('timeToDeath'));
        }
        if (this.getCookie('timeToDeath') !== undefined) {          
            this.timeToDeath.state = this.getCookie('stateTimeToDeath') === 'true';
        }
    }

    @action
    public saveCookies() {
        const dateForCookie = new Date;
        dateForCookie.setDate(dateForCookie.getDate() + 2);
        document.cookie = 'stateTimeToDeath=' + this.timeToDeath.state + '; expires=' + dateForCookie.toUTCString();
        if (!this.timeToDeath.state) {
            this.timeToDeath.ms = 0;
        }
        document.cookie = 'timeToDeath=' + this.timeToDeath.ms + '; expires=' + dateForCookie.toUTCString();
        this.timeToDeath.ms = this.timeToDeath.ms === 0 ? null : this.timeToDeath;
    }

    private getCookie(name) {
        const matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
}

export default new UIStore();
