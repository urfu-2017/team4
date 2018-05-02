import { observable, computed, action, runInAction } from 'mobx';

class UploadStore {
    @observable public state: string = 'initial';

    @computed get isFetching(): boolean {
        return this.state === 'initial';
    }

    @action public upload = async (file: File) => {
        if (this.isFetching) {
            return;
        }

        this.state = 'loading';

        const response = await fetch(`${window.location.origin}/upload`, {
            method: 'POST',
            body: file
        });

        if (response.status === 200) {
            runInAction(() => {
                this.state = 'success';
            })
        }

        runInAction(() => {
            this.state = 'error';
        })
    };
}
