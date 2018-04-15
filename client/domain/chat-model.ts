import { computed, observable } from 'mobx';

import RPC from '../utils/rpc-client';

export default class ChatModel {
    @observable.shallow public messages = [];

    @observable public isFetching = false;

    public id;
    public name;
    public members;
    public owner;
    public type: 'room' | 'dialog';

    @computed
    get lastMessage() {
        return this.messages[this.messages.length - 1] || null;
    }

    @computed
    get canLoadNextHistoryFrame() {
        const firstMessage = this.messages[0];
        return !(this.isFetching || !firstMessage || Number(firstMessage.frame) <= 0);
    }

    constructor({ id, name, members, owner, type }) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.owner = owner;
        this.type = type;
    }

    public async join() {
        try {
            this.isFetching = true;
            this.messages = await RPC.request('joinToDialog', { chatId: this.id }, 15000);
        } finally {
            this.isFetching = false;
        }
    }

    public async loadNextHistoryFrame() {
        if (!this.canLoadNextHistoryFrame) {
            return;
        }

        try {
            const firstMessage = this.messages[0];
            const firstFrame = Number(firstMessage.frame);

            this.isFetching = true;
            const messages = await RPC.request(
                'fetchHistory',
                {
                    chatId: this.id,
                    frame: firstFrame - 1
                },
                15000
            );

            this.messages = messages.concat(this.messages.slice());
        } finally {
            this.isFetching = false;
        }
    }

    public async sendMessage(text, ogData) {
        const params = {
            chatId: this.id,
            text,
            ogData
        };

        const response = await RPC.request('sendMessage', params, 15000);

        this.messages.push(response);
    }

    public onRecieveMessage(message) {
        this.messages.push(message);
    }
}
