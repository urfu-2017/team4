import { action, observable, runInAction } from 'mobx';

import RPC from '../utils/rpc-client';

class OGStore {
    @observable public state = 'initial';
    @observable public data = undefined;

    public url = '';
    public timeoutToFetch = undefined;
    public currentFetchingLink = undefined;

    @action
    public setUrl = url => {
        if (typeof url !== 'string' || this.state === 'loaded') {
            return;
        }
        this.url = url;

        clearTimeout(this.timeoutToFetch);
        this.timeoutToFetch = setTimeout(() => {
            this.fetchData();
        }, 1000);
    };

    @action
    public async fetchData() {
        if (!this.url) {
            return;
        }

        this.state = 'loading';
        this.currentFetchingLink = this.url;

        let data;

        try {
            data = await RPC.request('fetchOGData', { url: this.url }, 5000);
        } catch (e) {
            this.clear();
        }
        // Если промис устарел, то выходим из колбэка
        if (data.input !== this.currentFetchingLink) {
            return;
        }
        // Удаляем поле, нужное только для предыдущей проверки.
        delete data.input;

        if (!data) {
            this.clear();
            this.currentFetchingLink = undefined;

            return;
        }

        runInAction(() => {
            this.data = data;
            this.state = 'loaded';
            this.currentFetchingLink = undefined;
        });
    }

    @action
    public clear = () => {
        this.url = '';
        this.data = undefined;
        this.state = 'initial';
        this.timeoutToFetch = undefined;
    };
}

export default new OGStore();
