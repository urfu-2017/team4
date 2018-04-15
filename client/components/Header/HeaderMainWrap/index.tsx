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
            const currentUsername = UsersStore.currentUser.username;
            const otherUsername = chat.members.filter(member => member !== currentUsername)[0];
            const otherUser = UsersStore.users.get(otherUsername || currentUsername);

            message = otherUser.displayName;
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
