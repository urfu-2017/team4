import { observable, computed, action, runInAction } from 'mobx';
import { UPLOADS_URL } from '../config';

class UploadStore {
    @observable public state: string = 'initial';
    private controller: AbortController = new AbortController();
    private url: string = UPLOADS_URL;

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

        } catch (e) {
            runInAction(() => {
                this.state = 'error';
            });
        }
    };

    @action public clear = () => {
        this.controller.abort();
        this.controller = new AbortController();

        this.state = 'initial'
    };
}

export default UploadStore;
