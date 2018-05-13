import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import RPC from '../../utils/rpc-client';
import { Events } from '../../../shared/events';

import usersStore from '../../domain/users-store';
import chatsStore from '../../domain/chats-store';

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

        if (this.isActiveWindow && currentChat && currentChat.id === message.chatId) {
            return;
        }

        this.showNotification(message, chat);
    };

    private showNotification(message, chat) {
        Notification.requestPermission(permission => {
            if (permission !== 'granted') return;

            navigator.serviceWorker.ready.then(worker => {
                const user = usersStore.users.get(message.senderId);
                const body = `${message.attachment || ''} ${message.text}`.trim();
                const icon = chat.avatar;
                const data = { chatId: chat.id };

                const options: any = { icon, body, vibrate: [400], tag: chat.id, renotify: true, data };

                worker.showNotification(`Новое сообщение от ${user.displayName}`, options);
            });
        });
    }
}

export default Notificator;
