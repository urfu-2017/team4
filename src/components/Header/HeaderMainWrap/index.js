import React from 'react';
import { observer } from 'mobx-react';

import './HeaderMainWrap.css';
import ChatsStore from '../../../domain/chats-store';
import UsersStore from '../../../domain/users-store';

const HeaderMainWrap = observer(() => {
    let message = 'Выберите чат';
    const chat = ChatsStore.currentChat;

    if (chat !== null) {
        message = chat.name;
        message += chat.type === 'room' ? ` (${chat.members.length} участников)` : '';
    }

    const username = UsersStore.currentUser.displayName;

    return (
        <div className="header__main-wrap">
            <div className="header__chat-name">{message}</div>
            <div className="header__user-name">{username}</div>
        </div>
    );
});

export default HeaderMainWrap;
