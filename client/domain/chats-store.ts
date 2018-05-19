import { action, computed, observable, runInAction } from 'mobx';

import RPC from '../utils/rpc-client';
import { Events } from '../../shared/events';

import ChatModel from './chat-model';
import usersStore from './users-store';

class ChatsStore {
    @observable public chatsMap: Map<string, ChatModel> = new Map();

    @observable public currentChat: ChatModel = null;

    @computed
    get chats() {
        return Array.from(this.chatsMap.values());
    }

    constructor() {
        RPC.addListener(Events.NEW_MESSAGE, this.onNewMessage);
        RPC.addListener(Events.NEW_CHAT, this.onNewChat);
        RPC.addListener(Events.ADD_MEMBER, this.onAddMember);
        RPC.addListener(Events.REMOVE_MEMBER, this.onRemoveMember);
        RPC.addListener(Events.ADD_REACTION, this.onAddReaction);
        RPC.addListener(Events.REMOVE_REACTION, this.onRemoveReaction);
        RPC.addListener(Events.MUTE_CHANGED, this.onMuteChanged);
    }

    public async createChat(type, members, name = '') {
        const chat = await RPC.request('createChat', { type, members, name });
        return await this.saveChat(chat);
    }

    public async fetchChat(chatId) {
        const chatModel = this.chatsMap.get(chatId);
        if (chatModel) {
            return chatModel;
        }
        const chat = await RPC.request('getChatInfo', { chatId });
        if (chat) {
            return await this.saveChat(chat);
        }

        return null;
    }

    @action
    public async saveChat(chat: any, force: boolean = false): Promise<ChatModel> {
        let chatModel = this.chatsMap.get(chat.id);

        if (chatModel && !force) {
            return chatModel;
        }

        // Если чат есть был запускаем процедуру восстановления
        if (chatModel) {
            chatModel.members = chat.members.map(user => usersStore.saveUser(user, true));
            await chatModel.restore();
        } else {
            chatModel = new ChatModel(chat);
            chatModel.members = chatModel.members.map(user => usersStore.saveUser(user, force));
            await chatModel.join();
        }

        this.setChat(chatModel);
        return chatModel;
    }

    @action
    public setCurrentChat(chatId) {
        this.currentChat = this.chatsMap.get(chatId);
        this.currentChat.setNotification(false);
    }

    public findDialog(userId) {
        const currentUser = usersStore.currentUser;
        const dialog = this.chats.find(chat => {
            if (chat.type === 'dialog') {
                const members = chat.members.filter(member => member.id !== currentUser.id);
                const isSelf = userId === usersStore.currentUser.id && members.length === 0;

                return isSelf || !!members.find(member => member.id === userId);
            }

            return false;
        });

        return dialog || null;
    }

    public async leave(chat: ChatModel) {
        await chat.removeMember(usersStore.currentUser);

        runInAction(() => {
            this.chatsMap.delete(chat.id);
            if (this.currentChat === chat) {
                this.currentChat = null;
            }
        });
    }

    private onNewMessage = async message => {
        const { chatId } = message;
        const chat = this.chatsMap.get(chatId);

        if (chat) {
            chat.onReceiveMessage(message);
        }
    };

    private onNewChat = async chat => {
        await this.saveChat(chat);
    };

    private onAddMember = async ({ userId, chatId }) => {
        let chat = this.chatsMap.get(chatId);

        if (chat) {
            const user = await usersStore.fetchUser(userId);
            if (!chat.members.find(member => member.id === user.id)) {
                chat.members.push(user);
            }
        } else {
            chat = await RPC.request('getChatInfo', { chatId, subscribe: true }, 5000);
            await this.saveChat(chat);
        }
    };

    @action
    private onRemoveMember = async ({ userId, chatId }) => {
        const chat = this.chatsMap.get(chatId);

        if (chat) {
            chat.members = chat.members.filter(member => member.id !== userId);
        }
    };

    private onAddReaction = reaction => {
        const chat = this.chatsMap.get(reaction.chatId);
        if (!chat) return;

        const message = chat.messages.find(msg => msg.id === reaction.messageId);
        if (!message) return;

        message.reactions.push(reaction);
    };

    private onRemoveReaction = event => {
        const chat = this.chatsMap.get(event.chatId);
        if (!chat) return;

        const message = chat.messages.find(msg => msg.id === event.messageId);
        if (!message) return;

        message.reactions = message.reactions.filter(reaction => reaction.id !== event.reaction);
    };

    private onMuteChanged = event => {
        const chat = this.chatsMap.get(event.chatId);
        if (!chat) return;

        chat.muted = event.mute;
    };

    @action
    private setChat(chatModel: ChatModel) {
        this.chatsMap.set(chatModel.id, chatModel);
    }
}

export default new ChatsStore();
