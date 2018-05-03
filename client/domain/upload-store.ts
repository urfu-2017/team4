import { observable, computed, action, runInAction } from 'mobx';

class UploadStore {
    @observable public state: string = 'initial';
    private controller: AbortController = new AbortController();

    constructor(private url: string) {
    }

    @computed get isFetching(): boolean {
        return this.state === 'loading';
    }

    @computed get isError(): boolean {
        return this.state === 'error';
    }

    @action public upload = async (file: File) => {
        if (this.isFetching) {
            return;
        }

        this.state = 'loading';

        const response = await fetch(this.url, {
            method: 'POST',
            body: file,
            signal: this.controller.signal
        });

        if (response.status === 200) {
            runInAction(() => {
                this.state = 'success';
            });

            return;
        }

        runInAction(() => {
            this.state = 'error';
        });
        console.error('Failed to upload image');
    };

    @action public cancel = () => {
        this.controller.abort();
        this.controller = new AbortController();

        this.state = 'initial'
    };
}

export default UploadStore;
