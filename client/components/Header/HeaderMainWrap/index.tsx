import { observer } from 'mobx-react';
import React from 'react';

import ChatSettingsIcon from './ChatSettingsIcon';

import uiStore from '../../../domain/ui-store';
import chatsStore from '../../../domain/chats-store';
import { declOfNum } from '../../../utils/decOfNum';

import './HeaderMainWrap.css';

@observer
class HeaderMainWrap extends React.Component {

    private static strings = ['участник', 'участника', 'участников'];

    public render(): React.ReactNode {
        let message = 'Выберите чат';
        const chat = chatsStore.currentChat;

        if (chat !== null) {
            const members = chat.members.length;
            message = chat.displayName;
            message += (chat.type === 'room') ? ` (${members} ${declOfNum(members, HeaderMainWrap.strings)})` : '';
        }

        return (
            <div className="header__main-wrap">
                <div className="header__chat-name">{message}</div>
                {chat && (
                    <div
                        title="Информация о чате"
                        onClick={this.openChatInfo}
                        className={'header__chat-settings'}
                    >
                        <ChatSettingsIcon />
                    </div>
                )}
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
