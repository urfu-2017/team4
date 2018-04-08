/* eslint-disable no-restricted-syntax,no-await-in-loop */
import { observable, action, computed } from 'mobx';
import RPC from '../utils/rpc-client';
import ChatModel from './chat-model';

class ChatsStore {
    @observable chatsMap = new Map();
    @observable currentChat = null;

    @computed get chats() {
        return Array.from(this.chatsMap.values());
    }

    constructor() {
        RPC.addListener('newMessage', this.onNewMessage);
    }

    async init() {
        const chats = await RPC.request('fetchDialogs');

        for (const chat of chats) {
            const chatModel = new ChatModel(chat);
            this.chatsMap.set(chat.id, chatModel);

            chatModel.join();
        }
    }

    @action setCurrentChat(chatId) {
        this.currentChat = this.chatsMap.get(chatId);
    }

    onNewMessage = async (message) => {
        const { chatId } = message;
        const chat = this.chatsMap.get(chatId);

        if (chat) {
            // Добавляем сообщение в существующий чат
            chat.onRecieveMessage(message);
        } else {
            // Добавляем новый чат
            const newChat = await RPC.request('fetchChat', { chatId });

            if (newChat) {
                // Запрашиваем историю сообщений
                const chatModel = new ChatModel(chat);
                await chatModel.join();
                this.chatsMap.set(newChat.id, chatModel);
            }
        }
    }
}

export default new ChatsStore();
