import React from 'react';
import { observer } from 'mobx-react';

import './HeaderMainWrap.css';
import ChatsStore from '../../../domain/chats-store';

const HeaderMainWrap = observer(() => {
    let message = 'Выберите чат';
    const chat = ChatsStore.currentChat;

    if (chat !== null) {
        message = chat.name;
        message += chat.type === 'room' ? ` (${chat.members.length} участников)` : '';
    }

    return (
        <div className="header__main-wrap">
            <div className="header__user-name">{message}</div>
        </div>
    );
});

export default HeaderMainWrap;
