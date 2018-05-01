import { action, computed, observable } from 'mobx';

import RPC from '../utils/rpc-client';
import ChatModel from './chat-model';
import UsersStore from './users-store';

class ChatsStore {

    @observable
    public chatsMap = new Map();

    @observable
    public currentChat = null;

    @computed
    get chats() {
        return Array.from(this.chatsMap.values());
    }

    constructor() {
        RPC.addListener('newMessage', this.onNewMessage);
    }

    public init() {
        const chats = UsersStore.currentUser.chats;

        chats.filter(chat => chat !== null).forEach(chat => {
            const chatModel = this.saveChat(chat);
            chatModel.join();
        });
    }

    public async createChat(type, members, name = '') {
        const chat = await RPC.request('createChat', { type, members, name }, 15000);
        const chatModel = this.saveChat(chat);
        await chatModel.join();

        return chatModel;
    }

    public saveChat(chat): ChatModel {
        const chatModel = new ChatModel(chat);
        chatModel.members.map(user => UsersStore.saveUser(user));
        chatModel.loadNextHistoryFrame();

        this.chatsMap.set(chat.id, chatModel);

        return chatModel;
    }

    @action
    public setCurrentChat(chatId) {
        this.currentChat = this.chatsMap.get(chatId);
    }

    public findDialog(userId) {
        const dialog = Array.from(this.chatsMap.values())
            .find(chat => chat.type === 'dialog' &&
                chat.members.map(member => member.id).includes(userId));

        return dialog || null;
    }

    private onNewMessage = async message => {
        const { chatId } = message;
        const chat = this.chatsMap.get(chatId);

        if (chat) {
            // Добавляем сообщение в существующий чат
            chat.onRecieveMessage(message);
        } else {
            // Добавляем новый чат
            const newChat = await RPC.request('getChatInfo', { chatId, subscribe: true });

            if (newChat) {
                // Запрашиваем историю сообщений
                const chatModel = this.saveChat(newChat);
                await chatModel.join();
            }
        }
    };
}

export default new ChatsStore();
