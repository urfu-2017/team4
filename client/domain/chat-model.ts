import { computed, observable } from 'mobx';

import RPC from '../utils/rpc-client';
import UserModel from './user-model';

export default class ChatModel {
    @observable.shallow public messages = [];

    @observable public isFetching = false;

    public id;
    public name;

    @observable
    public members: UserModel[] = [];

    public owner;
    public type: 'room' | 'dialog';

    @computed
    get lastMessage() {
        return this.messages[this.messages.length - 1] || null;
    }

    constructor({ id, name, members, owner, type }) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.owner = owner;
        this.type = type;
    }

    public async join() {
        await this.loadNextHistoryFrame();
        await RPC.request('subscribeToChat', { chatId: this.id }, 15000);
    }

    public async loadNextHistoryFrame() {
        if (this.isFetching) {
            return;
        }

        try {
            this.isFetching = true;
            const oldestMessage = this.messages[0];

            const messages = await RPC.request(
                'getChatMessages',
                {
                    chatId: this.id,
                    from: oldestMessage ? oldestMessage.creationDate : null
                },
                15000
            );

            this.messages = messages.concat(this.messages.slice());
        } finally {
            this.isFetching = false;
        }
    }

    public async sendMessage(text, attachment) {
        const params = {
            chatId: this.id,
            text,
            attachment
        };

        const response = await RPC.request('sendMessage', params, 15000);

        this.messages.push(response);
    }

    public async addMember(user: UserModel) {
        if (this.members.find(member => member.id === user.id)) {
            return;
        }

        await RPC.request('addMember', { chatId: this.id, userId: user.id });
        this.members.push(user);
    }

    public async removeMember(user: UserModel) {
        if (!this.members.find(member => member.id === user.id)) {
            return;
        }

        await RPC.request('removeMember', { chatId: this.id, userId: user.id });
        this.members = this.members.filter(member => member.id !== user.id);
    }

    public onReceiveMessage(message) {
        this.messages.push(message);
    }
}
