import { observer } from 'mobx-react';
import React from 'react';

import ChatsStore from '../../../domain/chats-store';
import UsersStore from '../../../domain/users-store';
import './HeaderMainWrap.css';

const HeaderMainWrap = observer(() => {
    let message = 'Выберите чат';
    const chat = ChatsStore.currentChat;

    if (chat !== null) {
        if (chat.type === 'dialog') {
            const currentUserId = UsersStore.currentUser.id;
            const otherUser = chat.members.find(member => member.id !== currentUserId);
            const otherUserModel = UsersStore.users.get(otherUser ? otherUser.id : currentUserId);

            message = otherUserModel.displayName;
        } else {
            message = `${chat.name} (${chat.members.length} участников)`;
        }
    }

    return (
        <div className="header__main-wrap">
            <div className="header__chat-name">{message}</div>
        </div>
    );
});

export default HeaderMainWrap;
