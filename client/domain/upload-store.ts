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
        if (file.size > 20000000) {
            this.state = 'error';

            return;
        }

        if (this.isFetching) {
            return;
        }

        this.state = 'loading';

        const body = new FormData();
        body.append('file', file);

        let response;

        try {
            response = await fetch(this.url, {
                method: 'POST',
                body,
                signal: this.controller.signal,
                credentials: 'include'
            });

            if (response.ok) {
                runInAction(() => {
                    this.state = 'success';
                });

                return response.json();
            }

            runInAction(() => {
                this.state = 'error';
            });
            console.error('Failed to upload image');

        } catch (e) {
            runInAction(() => {
                this.state = 'error';
            });
            console.error('Failed to upload image');
        }
    };

    @action public cancel = () => {
        this.controller.abort();
        this.controller = new AbortController();

        this.state = 'initial'
    };
}

export default UploadStore;
