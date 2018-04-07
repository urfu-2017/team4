import { observable } from 'mobx';

import RPC from '../utils/rpc-client';

export default class ChatModel {
    @observable messages = [];

    constructor({ id, name, members, owner, type }) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.owner = owner;
        this.type = type;
    }

    async join() {
        this.messages = (await RPC.request('fetchHistory', { chatId: this.id }, 15000)) || [];
        await RPC.request('joinToDialogs', { dialogs: [this.id] });
    }

    async sendMessage(text) {
        const response = await RPC.request('sendMessage', { chatId: this.id, text }, 15000);
        this.messages.push(response);
    }

    onRecieveMessage(message) {
        this.messages.push(message);
    }
}
