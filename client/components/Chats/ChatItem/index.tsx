import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import b_ from 'b_';

import markdown from '../../../utils/markdown';
import getPlainText from '../../../utils/plain-text';

import uiStore from '../../../domain/ui-store';
import ChatsStore from '../../../domain/chats-store';
import UsersStore from '../../../domain/users-store';
import formatDate from '../../../utils/format-date';

import './ChatItem.css';
const b = b_.with('dialog-list');

interface Props {
    chat: any;
}

@observer
class ChatItem extends React.Component<Props> {
    @computed
    get message() {
        const { chat } = this.props;

        if (!chat || !chat.lastMessage) {
            return null;
        }

        return chat.lastMessage;
    }

    public render() {
        const { chat } = this.props;

        const dark = uiStore.isDark;

        const modifiers = { active: ChatsStore.currentChat === chat, dark };
        const isMine = this.message && this.message.senderId === UsersStore.currentUser.id;
        const isAttachment = this.message && this.message.attachment;

        return (
            <Link to={`/chats/${chat.id}`} className={`${b('item', modifiers)}`}>
                <img src={chat.avatar} alt="" className={b('dialog-image')} />
                <div className={b('dialog-body')}>
                    <div className={b('dialog-name', { dark })} title={chat.displayName}>
                        {chat.displayName}
                    </div>
                    {this.message && (
                        <div className={b('last-msg')}>
                            <span className={b('last-msg-mine', { dark })}>{isMine && 'Вы: '}</span>
                            {`${isAttachment ? 'Фотография.' : ''} ${getPlainText(markdown(this.message.text))}`}
                        </div>
                    )}
                </div>
                {this.message && (
                    <div className={b('last-msg-date')}>{formatDate(this.message.createdAt)}</div>
                )}
            </Link>
        );
    }
}

export default ChatItem;
