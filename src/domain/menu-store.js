import { observable, action } from 'mobx';

class MenuStore {
    @observable isShow;

    constructor() {
        this.isShow = false;
    }

    @action('toggle left panel')
    toggleLeftPanel() {
        this.isShow = !this.isShow;
    }
}

export default new MenuStore();
