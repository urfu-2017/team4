import { action, computed, observable } from 'mobx';

import RPC from '../utils/rpc-client';
import { Events } from '../../shared/events';

import ChatModel from './chat-model';
import usersStore from './users-store';

class ChatsStore {
    @observable
    public chatsMap: Map<string, ChatModel> = new Map();

    @observable
    public currentChat: ChatModel = null;

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
        RPC.addListener(Events.REMOVE_REACTION, this.onRemoveReaction)
    }

    public init() {
        const chats = usersStore.currentUser.chats;

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
        chatModel.members = chatModel.members.map(user => usersStore.saveUser(user));
        chatModel.join();

        this.chatsMap.set(chat.id, chatModel);

        return chatModel;
    }

    @action
    public setCurrentChat(chatId) {
        this.currentChat = this.chatsMap.get(chatId);
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
        this.chatsMap.delete(chat.id);

        if (this.currentChat === chat) {
            this.currentChat = null;
        }
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
            console.info()
            chat.members.push(user);
        } else {
            chat = await RPC.request('getChatInfo', { chatId, subscribe: true }, 5000);
            const chatModel = this.saveChat(chat);
            await chatModel.loadNextHistoryFrame();
        }
    };

    private onRemoveMember = async ({ userId, chatId }) => {
        const chat = this.chatsMap.get(chatId);

        if (chat) {
            chat.members = chat.members.filter(member => member.id !== userId);
        }
    }

    private onAddReaction = (reaction) => {
        const chat = this.chatsMap.get(reaction.chatId);
        if (!chat) return;

        const message = chat.messages.find(msg => msg.id === reaction.messageId);
        if (!message) return;

        message.reactions.push(reaction);
    }

    private onRemoveReaction = (event) => {
        const chat = this.chatsMap.get(event.chatId);
        if (!chat) return;

        const message = chat.messages.find(msg => msg.id === event.messageId);
        if (!message) return;

        message.reactions = message.reactions.filter(reaction => reaction.id !== event.reaction);
    };
}

export default new ChatsStore();
