import { observable, computed } from 'mobx';

import RPC from '../utils/rpc-client';

export default class ChatModel {
    @observable messages = [];
    @observable isFetching = false;

    @computed get lastMessage() {
        return this.messages[this.messages.length - 1] || null;
    }

    @computed get canLoadNextHistoryFrame() {
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

    async join() {
        try {
            this.isFetching = true;
            this.messages = (await RPC.request('fetchHistory', { chatId: this.id }, 15000)) || [];
            await RPC.request('joinToDialogs', { dialogs: [this.id] });
        } finally {
            this.isFetching = false;
        }
    }

    async loadNextHistoryFrame() {
        if (!this.canLoadNextHistoryFrame) {
            return;
        }

        try {
            const firstMessage = this.messages[0];
            const firstFrame = Number(firstMessage.frame);

            this.isFetching = true;
            const messages = await RPC.request('fetchHistory', {
                chatId: this.id,
                frame: firstFrame - 1
            }, 15000);

            this.messages = messages.concat(this.messages.slice());
        } finally {
            this.isFetching = false;
        }
    }

    async sendMessage(text) {
        const response = await RPC.request('sendMessage', { chatId: this.id, text }, 15000);
        this.messages.push(response);
    }

    onRecieveMessage(message) {
        this.messages.push(message);
    }
}
