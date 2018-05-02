import React from 'react';
import b_ from 'b_';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import Popup from '../Popup';
import FullUserInfo from '../UserInfo/Full';
import UsersList from '../UsersList';

import uiStore from '../../domain/ui-store';
import chatsStore from '../../domain/chats-store';
import usersStore from '../../domain/users-store';

import './ChatInfo.css';
import AddMember from './AddMember';

const b = b_.with('chat-info');

@observer
class ChatInfo extends React.Component {
    private static closePopup() {
        uiStore.togglePopup('chatInfo')();
    }

    @observable private isAddMode: boolean = false;

    public render(): React.ReactNode {
        if (!chatsStore.currentChat) {
            return null;
        }

        if (chatsStore.currentChat.type === 'dialog') {
            return this.renderUserInfo();
        }

        return this.renderRoomInfo();
    }

    private renderUserInfo() {
        const user =
            chatsStore.currentChat.members.find(
                member => member.id !== usersStore.currentUser.id
            ) || usersStore.currentUser;

        console.info('USER INFO', user);

        return (
            <Popup className={b()} zIndex={300} closeHandler={ChatInfo.closePopup}>
                <h3 className={b('title') + ' header3'}>Информация о пользователе</h3>
                <FullUserInfo user={user} />
            </Popup>
        );
    }

    private renderRoomInfo() {
        const chat = chatsStore.currentChat;

        return (
            <React.Fragment>
                <Popup className={b()} zIndex={300} closeHandler={ChatInfo.closePopup}>
                    <h3 className={b('room-title') + ' header2'}>{chat.name}</h3>
                    <div className={b('actions')}>
                        <span className={b('action')} onClick={this.enableAddMode}>
                            Добавить участника
                        </span>
                        <span className={b('action')}>
                            Скопировать invite-ссылку
                        </span>
                        <span onClick={this.leaveChat} className={b('action', { danger: true })}>
                            Покинуть группу
                        </span>
                    </div>
                    <div className={b('field')}>{chat.members.length} участников:</div>
                    <UsersList
                        className={b('members')}
                        disableSearch={true}
                        users={chat.members}
                        onClick={this.openUserProfile}
                    />
                </Popup>
                {this.isAddMode && <AddMember chat={chat} closeHandler={this.disableAddMode} />}
            </React.Fragment>
        );
    }

    private enableAddMode = () => {
        this.isAddMode = true;
    };

    private disableAddMode = () => {
        this.isAddMode = false;
    };

    private openUserProfile = (id: number) => {
        const user = usersStore.users.get(id);

        if (user) {
            uiStore.togglePopup('chatInfo')();
            uiStore.toggleUserInfoPopup(user);
        }
    };

    private leaveChat = async() => {
        await chatsStore.leave(chatsStore.currentChat);
        uiStore.togglePopup('chatInfo')();
    }
}

export default ChatInfo;
