import { observer } from 'mobx-react';
import React from 'react';

import ChatSettingsIcon from './ChatSettingsIcon';

import uiStore from '../../../domain/ui-store';
import chatsStore from '../../../domain/chats-store';
import usersStore from '../../../domain/users-store';

import './HeaderMainWrap.css';

@observer
class HeaderMainWrap extends React.Component {

    public render(): React.ReactNode {
        let message = 'Выберите чат';
        const chat = chatsStore.currentChat;

        if (chat !== null) {
            if (chat.type === 'dialog') {
                const currentUserId = usersStore.currentUser.id;
                const otherUser = chat.members.find(member => member.id !== currentUserId);
                const otherUserModel = usersStore.users.get(otherUser ? otherUser.id : currentUserId);

                message = otherUserModel.displayName;
            } else {
                message = `${chat.name} (${chat.members.length} участников)`;
            }
        }

        return (
            <div className="header__main-wrap">
                <div className="header__chat-name">{message}</div>
                {chat && <ChatSettingsIcon onClick={this.openChatInfo} className="header__chat-settings"/>}
            </div>
        );
    }

    private openChatInfo = () => {
        const chat = chatsStore.currentChat;

        if (!chat) {
            return;
        }

        uiStore.togglePopup('chatInfo')();
    };
}

export default HeaderMainWrap;
