import { action, computed, observable } from 'mobx';

import RPC from '../utils/rpc-client';
import ChatModel from './chat-model';
import UsersStore from './users-store';

class ChatsStore {
    @observable public chatsMap = new Map();

    @observable public currentChat = null;

    @computed
    get chats() {
        return Array.from(this.chatsMap.values());
    }

    constructor() {
        RPC.addListener('newMessage', this.onNewMessage);
    }

    public async init() {
        const chats = await RPC.request('fetchDialogs');

        for (const chat of chats) {
            // eslint-disable-next-line no-continue
            if (chat === null) continue;

            const chatModel = new ChatModel(chat);
            this.chatsMap.set(chat.id, chatModel);

            chatModel.members.forEach(username => {
                UsersStore.fetchUser(username);
            });

            chatModel.join();
        }
    }

    public async createChat(type, members, name = '') {
        const chat = await RPC.request('createDialog', { type, members, name }, 15000);
        const chatModel = new ChatModel(chat);
        await chatModel.join();

        chatModel.members.forEach(username => {
            UsersStore.fetchUser(username);
        });

        this.chatsMap.set(chat.id, chatModel);
        return chatModel;
    }

    @action
    public setCurrentChat(chatId) {
        this.currentChat = this.chatsMap.get(chatId);
    }

    public findDialog(username) {
        const currentUsername = UsersStore.currentUser.username;

        const id = [currentUsername, username].sort((a, b) => a.localeCompare(b)).join('_');
        const chat = this.chatsMap.get(id);

        return chat || null;
    }

    private onNewMessage = async message => {
        const { chatId } = message;
        const chat = this.chatsMap.get(chatId);

        if (chat) {
            // Добавляем сообщение в существующий чат
            chat.onRecieveMessage(message);
        } else {
            // Добавляем новый чат
            const newChat = await RPC.request('fetchDialog', { chatId });

            if (newChat) {
                // Запрашиваем историю сообщений
                const chatModel = new ChatModel(newChat);
                await chatModel.join();
                this.chatsMap.set(newChat.id, chatModel);

                chatModel.members.forEach(username => {
                    UsersStore.fetchUser(username);
                });
            }
        }
    };
}

export default new ChatsStore();
