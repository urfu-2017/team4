import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import RPC from '../../utils/rpc-client';
import { Events } from '../../../shared/events';

import usersStore from '../../domain/users-store';
import chatsStore from '../../domain/chats-store';
import getPlainText from '../../utils/plain-text';
import markdown from '../../utils/markdown';
import findMentions from '../../../shared/utils/findMentions';

@observer
class Notificator extends React.Component {

    @observable
    private isActiveWindow: boolean = true;

    public componentDidMount() {
        RPC.addListener(Events.NEW_MESSAGE, this.notify);
        window.addEventListener('focus', () => this.isActiveWindow = true);
        window.addEventListener('blur', () => this.isActiveWindow = false);
    }

    public componentWillUnmount() {
        RPC.removeListener(Events.NEW_MESSAGE, this.notify);
    }

    public render(): React.ReactNode {
        return (
            <div style={{ display: 'none' }}/>
        );
    }

    private notify = message => {
        const currentChat = chatsStore.currentChat;
        const chat = chatsStore.chatsMap.get(message.chatId);
        const isCurrentUser = usersStore.currentUser.id === message.senderId;
        const mentions = findMentions(message.text);

        if (isCurrentUser) return;
        if (this.isActiveWindow && currentChat && currentChat.id === message.chatId) return;
        if (chat.muted && !mentions.includes(usersStore.currentUser.username.toLowerCase())) return;

        this.showNotification(message, chat);
    };

    private showNotification(message, chat) {
        if (!('Notification' in window)) return;

        Notification.requestPermission(permission => {
            if (permission !== 'granted') return;

            const { attachment, text, senderId } = message;

            const user = usersStore.users.get(senderId);
            const title = 'Новое сообщение ' + (chat.type === 'dialog' ? 'от ' + user.displayName : 'в ' + chat.name);
            const prefix = chat.type === 'dialog' ? '' : user.displayName + ': ';
            const body = prefix + (message.forwarded ? 'Пересланное сообщение' :
                (attachment ? 'Фотография. ' : '') + text);

            const icon = chat.avatar;
            const data = { chatId: chat.id };

            const options: any = { icon, body, vibrate: [600, 200, 600], tag: chat.id, renotify: true, data };

            navigator.serviceWorker.ready.then(worker => {
                worker.showNotification(title, options);
            });
        });
    }
}

export default Notificator;
