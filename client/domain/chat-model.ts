import { computed, observable, action } from 'mobx';

import RPC from '../utils/rpc-client';
import UserModel from './user-model';
import UsersStore from './users-store';

export default class ChatModel {
    @observable public messages = [];

    @observable public isFetching = false;

    public id;
    public name;

    @observable
    public members: UserModel[] = [];

    public owner;
    public type: 'room' | 'dialog';

    @observable
    public canLoadNextHistoryFrame: boolean = true;

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
        const currentUserId = UsersStore.currentUser.id;
        if (!this.members.find(user => user.id === currentUserId)) {
            await RPC.request('addMember', {
                chatId: this.id,
                userId: currentUserId
            });
            this.members.push(UsersStore.currentUser);
        }
        if (!this.messages.length) {
            await this.loadNextHistoryFrame();
        }
        await RPC.request('subscribeToChat', { chatId: this.id }, 15000);
    }

    public async loadNextHistoryFrame() {
        if (this.isFetching) {
            return;
        }

        try {
            this.isFetching = true;
            const oldestMessage = this.messages.length ? this.messages[0] : undefined;

            const messages = await RPC.request(
                'getChatMessages',
                {
                    chatId: this.id,
                    from: oldestMessage ? oldestMessage.createdAt : null
                },
                15000
            );

            if (messages.length === 0) {
                this.canLoadNextHistoryFrame = false;
                return;
            }

            await Promise.all(
                messages.map(message => UsersStore.fetchUser(message.senderId)));

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
        this.messages.push({ ...response, reactions: [] });
    }

    public async addReaction(smile, messageId) {
        const reaction = await RPC.request('addReaction', { name: smile, messageId });
        const message = this.messages.find(msg => msg.id === messageId);

        message.reactions.push(reaction);
    }

    public async removeReaction(reactionId, messageId) {
        await RPC.request('removeReaction', { reactionId });
        const message = this.messages.find(msg => msg.id === messageId);

        message.reactions = message.reactions.filter(reaction => reaction.id !== reactionId);
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

    public async onReceiveMessage(message) {
        await UsersStore.fetchUser(message.senderId);
        this.messages.push({ ...message, reactions: [] });
    }
}
