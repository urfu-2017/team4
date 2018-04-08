import React from 'react';
import { observer } from 'mobx-react';

import './HeaderMainWrap.css';
import ChatsStore from '../../../domain/chats-store';

const HeaderMainWrap = observer(() => {
    let message = 'Выберите чат';

    if (ChatsStore.currentChat !== null) {
        message = ChatsStore.currentChat.name;
    }

    return (
        <div className="header__main-wrap">
            <div className="header__user-name">{message}</div>
        </div>
    );
});

export default HeaderMainWrap;
