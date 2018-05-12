import React from 'react';
import b_ from 'b_';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import Popup from '../Popup';
import uiStore from '../../domain/ui-store';
import chatsStore from '../../domain/chats-store';
import usersStore from '../../domain/users-store';

import './SelectChat.css';
import Button from '../Button';
const b = b_.with('select-chat');

@observer
class SelectChat extends React.Component<RouteComponentProps<{}>> {
    private static closePopup() {
        uiStore.setForwardMessage(null);
        uiStore.togglePopup('selectChat')();
    }

    @computed
    private get chats() {
        const chats = chatsStore.chats.map(chat => {
            let name = '';
            let avatar = '';

            if (chat.type === 'dialog') {
                // TODO: Вынести в модель чата
                const currentUserId = usersStore.currentUser.id;
                const otherUser = chat.members.filter(member => member.id !== currentUserId)[0];
                const user = usersStore.users.get(otherUser ? otherUser.id : currentUserId);

                name = user.displayName;
                avatar = user.avatar;
            } else {
                const letters = chat.name.split(' ').slice(0, 2).map(word => word[0]).join('');
                name = chat.name;
                avatar = `https://via.placeholder.com/64x64/74669b/ffffff?text=${letters}`;
            }

            return { name, avatar, id: chat.id };
        });

        return chats.sort((c1, c2) => c1.name.localeCompare(c2.name));
    }

    public render(): React.ReactNode {
        return (
            <Popup zIndex={500} className={b()} closeHandler={SelectChat.closePopup}>
                <h2 className={`${b('title')} header3`}>Выберите чат</h2>
                <div className={b('list')}>
                    {this.chats.map(chat => (
                        <div key={chat.id} className={b('chat')} data-chat={chat.id} onClick={this.sendMessage}>
                            <img className={b('chat-avatar')} src={chat.avatar} alt={chat.name} />
                            <div className={b('chat-name')}>{chat.name}</div>
                        </div>
                    ))}
                </div>
                <div className={b('actions')}>
                    <Button onClick={SelectChat.closePopup}>Отменить</Button>
                </div>
            </Popup>
        );
    }

    private sendMessage = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        const chatId = event.currentTarget.dataset.chat;
        const chat = chatsStore.chatsMap.get(chatId);

        console.info('Forward Message to', chat);
        this.props.history.push(`/chats/${chat.id}`);
        SelectChat.closePopup();
    }
}

export default withRouter(SelectChat);
