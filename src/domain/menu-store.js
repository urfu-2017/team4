import { observable, action } from 'mobx';

class MenuStore {
    @observable isShow = false;

    toggleLeftPanel = action('toggle left panel', () => {
        this.isShow = !this.isShow;
    })
}

export default new MenuStore();
