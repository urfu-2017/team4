import { observable, computed, action } from 'mobx';
import httpClient from '../utils/http-client';

class SessionStore {
    @observable currentUser = null;

    @computed get isAuth() {
        return this.currentUser !== null;
    }

    async fetchCurrentUser() {
        const response = await httpClient('/api/me');
        const user = response.body;

        if (user === null) {
            return;
        }

        this.currentUser = user;
    }

    @action
    clear() {
        this.currentUser = null;
    }
}

export default new SessionStore();
