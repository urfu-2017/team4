import { computed, observable, action, runInAction, reaction } from 'mobx';
import { v4 } from 'uuid';

import RPC from '../utils/rpc-client';

import UserModel from './user-model';
import UsersStore from './users-store';
import ChatsStore from './chats-store';
import UIStore from './ui-store';

interface MessageRequest {
    text?: string;
    attachment?: string;
    timeToDeath?: number;
    forwarded?: any;
}

export default class ChatModel {
    @observable public messages = [];
    @observable public sendingMessages = [];
    @observable public isFetching: boolean = false;

    @observable public hasNotification: boolean = false;

    public id;
    public name;

    @observable public members: UserModel[] = [];

    public owner;
    public type: 'room' | 'dialog';

    @observable public canLoadNextHistoryFrame: boolean = true;

    @computed
    public get lastMessage() {
        return this.messages[this.messages.length - 1] || null;
    }

    @computed
    public get displayName(): string {
        return this.otherUser ? this.otherUser.displayName : this.name;
    }

    @computed
    public get avatar() {
        if (this.otherUser) {
            return this.otherUser.avatar;
        }

        const letters = this.displayName
            .split(' ')
            .slice(0, 2)
            .map(word => word[0])
            .join('');
        return `https://via.placeholder.com/64x64/74669b/ffffff?text=${letters}`;
    }

    private queue: Promise<any> = Promise.resolve();

    @computed
    private get otherUser(): UserModel {
        if (this.type === 'dialog') {
            const currentUserId = UsersStore.currentUser.id;
            const otherUser = this.members.filter(member => member.id !== currentUserId)[0];
            const user = UsersStore.users.get(otherUser ? otherUser.id : currentUserId);

            return user;
        }

        return null;
    }

    constructor({ id, name, members, owner, type }) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.owner = owner;
        this.type = type;

        this.sendingMessages = JSON.parse(sessionStorage.getItem(`queue_${this.id}`)) || [];

        // После каждого изменения записываем данные об очереди сообщений
        reaction(() => this.sendingMessages, () => {
            sessionStorage.setItem(`queue_${this.id}`, JSON.stringify(this.sendingMessages));
        })
    }

    @action
    public async restore() {
        await this.join(true);

        for (const sendingMessage of this.sendingMessages) {
            this.queue = RPC.request('sendMessage', sendingMessage).then(
                (response) => this.addMessage(response, sendingMessage.id),
                () => Promise.resolve()
            );
        }
    }

    public async join(force: boolean = false) {
        const currentUserId = UsersStore.currentUser.id;

        if (!this.members.find(user => user.id === currentUserId)) {
            await RPC.request('addMember', {
                chatId: this.id,
                userId: currentUserId
            });

            this.members.push(UsersStore.currentUser);
        }

        if (!this.messages.length) {
            await this.loadNextHistoryFrame(force);
        }

        await RPC.request('subscribeToChat', { chatId: this.id });
    }

    public async loadNextHistoryFrame(force: boolean = false) {
        if (this.isFetching) {
            return;
        }

        try {
            this.setFetching(true);
            const oldestMessage = this.messages.length ? this.messages[0] : undefined;

            const messages = await RPC.request('getChatMessages', {
                chatId: this.id,
                from: oldestMessage && !force ? oldestMessage.createdAt : null
            });

            if (messages.length === 0) {
                this.canLoadNextHistoryFrame = false;
                return;
            }

            await Promise.all(messages.map(message => {
                if (message.forwarded) {
                    UsersStore.fetchUser(message.forwarded.senderId);
                }

                return UsersStore.fetchUser(message.senderId);
            }));

            messages.forEach(message => this.configureDeath(message));

            runInAction(() => {
                this.messages = force ? messages : messages.concat(this.messages.slice());
                this.setFetching(false);
            });
        } catch (e) {
            console.error(e);
            UIStore.setToast('Не удалось получить сообщения');
            this.setFetching(false);
        }
    }

    @action
    public sendMessage({ text = '', attachment, timeToDeath = null, forwarded }: MessageRequest) {
        const senderId = UsersStore.currentUser.id;
        const tempId = v4();
        const message = {
            id: tempId,
            chatId: this.id,
            senderId,
            text,
            attachment,
            timeToDeath,
            reactions: [],
            forwarded
        };

        this.configureDeath(message);
        this.sendingMessages.push(message);
        this.queue = RPC.request('sendMessage', message).then(
            (response) => this.addMessage(response, tempId),
            () => Promise.resolve()
        );
    }

    public async addReaction(smile, messageId) {
        const newReaction = await RPC.request('addReaction', { name: smile, messageId });
        const message = this.messages.find(msg => msg.id === messageId);

        runInAction(() => {
            message.reactions.push(newReaction);
        });
    }

    public async removeReaction(reactionId, messageId) {
        await RPC.request('removeReaction', { reactionId });
        const message = this.messages.find(msg => msg.id === messageId);

        runInAction(() => {
            message.reactions = message.reactions.filter(rcn =>rcn.id !== reactionId);
        });
    }

    public async addMember(user: UserModel) {
        if (this.members.find(member => member.id === user.id)) {
            return;
        }

        await RPC.request('addMember', { chatId: this.id, userId: user.id });

        runInAction(() => {
            this.members.push(user);
        });
    }

    public async removeMember(user: UserModel) {
        if (!this.members.find(member => member.id === user.id)) {
            return;
        }

        await RPC.request('removeMember', { chatId: this.id, userId: user.id });

        runInAction(() => {
            this.members = this.members.filter(member => member.id !== user.id);
        });
    }

    public async onReceiveMessage(message) {
        await UsersStore.fetchUser(message.senderId);

        console.info(message.forwarded);
        if (message.forwarded) {
            await UsersStore.fetchUser(message.forwarded.senderId);
        }

        this.addMessage(message);

        if (ChatsStore.currentChat !== this) {
            this.setNotification(true);
        }
    }

    @action
    public setNotification(has: boolean) {
        this.hasNotification = has;
    }

    @action
    private addMessage(message: any, tempId?: string) {
        this.configureDeath(message);
        if (tempId) {
            this.sendingMessages = this.sendingMessages.filter(msg => msg.id !== tempId);
        }

        this.messages.push({ ...message, reactions: [] });
    }

    private setFetching(fetching: boolean) {
        this.isFetching = fetching;
    }

    private configureDeath(message) {
        if (!message.timeToDeath) {
            return;
        }

        if (message.timeToDeath <= 0) {
           this.removeMessage(message);
        } else {
           setTimeout(this.removeMessage.bind(this, message), message.timeToDeath);
        }
    }

    @action
    private removeMessage(message) {
        this.messages = this.messages.filter(msg => msg.id !== message.id);
        this.sendingMessages = this.sendingMessages.filter(msg => msg.id !== message.id);
    }
}
