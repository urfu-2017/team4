import React from 'react';
import { observer } from 'mobx-react';

import RPC from '../../utils/rpc-client';
import { Events } from '../../../shared/events';

import usersStore from '../../domain/users-store';
import chatsStore from '../../domain/chats-store';
import sound from './notification.mp3';

@observer
class Notificator extends React.Component {
    private audioPlayer: HTMLAudioElement;

    public componentDidMount() {
        RPC.addListener(Events.NEW_MESSAGE, this.notify);
    }

    public componentWillUnmount() {
        RPC.removeListener(Events.NEW_MESSAGE, this.notify);
    }

    public render(): React.ReactNode {
        return (
            <audio
                style={{ display: 'none' }}
                ref={audio => (this.audioPlayer = audio)}
                src={sound}
                autoPlay={false}
                controls={false}
            />
        );
    }

    private notify = message => {
        const chat = chatsStore.currentChat;
        if (chat && chat.id !== message.chatId) {
            this.playSound();
            this.showNotification(message, chat);
        }
    };

    private playSound() {
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.play();
    }

    private showNotification(message, chat) {
        Notification.requestPermission(permission => {
            if (permission !== 'granted') return;

            navigator.serviceWorker.ready.then(worker => {
                const user = usersStore.users.get(message.senderId);
                const body = `${message.attachment || ''} ${message.text}`.trim();
                const image = chat.avatar;

                const options: any = { image, body, vibrate: [400], tag: chat.id };

                worker.showNotification(`Новое сообщение от ${user.displayName}`, options);
            });
        })
    }
}

export default Notificator;
