import { observable, action, runInAction } from 'mobx';

import RPC from '../utils/rpc-client';

class OGStore {
    @observable state = 'initial';
    @observable data = undefined;

    url = '';
    timeoutToFetch = undefined;

    @action setUrl = (url) => {
        if (typeof url !== 'string' || this.state === 'loaded') {
            return;
        }
        this.url = url;

        clearTimeout(this.timeoutToFetch);
        this.timeoutToFetch = setTimeout(() => {
            this.fetchData();
        }, 500);
    };

    @action
    async fetchData() {
        this.state = 'loading';

        let data;

        try {
            console.log(this.url);
            data = await RPC.request('fetchOGData', { url: this.url }, 5000);
        } catch (e) {
            console.log(e);
            this.clear();
        }

        if (!data) {
            return;
        }

        runInAction(() => {
            this.data = data;
            this.state = 'loaded';
            console.log(data);
        });
    }

    @action clear = () => {
        this.url = '';
        this.data = undefined;
        this.state = 'initial';
        this.timeoutToFetch = undefined;
    }
}

export default new OGStore();
