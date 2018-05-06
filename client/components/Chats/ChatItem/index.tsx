import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import b_ from 'b_';

import markdown from '../../../utils/markdown';
import getPlainText from '../../../utils/plain-text';

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

    @computed
    get user() {
        const { chat } = this.props;

        if (chat.type === 'dialog') {
            const currentUserId = UsersStore.currentUser.id;
            const otherUser = chat.members.filter(member => member.id !== currentUserId)[0];
            const user = UsersStore.users.get(otherUser ? otherUser.id : currentUserId);

            return user || null;
        }

        return null;
    }

    @computed
    get displayName() {
        return this.user ? this.user.displayName : this.props.chat.name;
    }

    @computed
    get avatar() {
        if (this.user && this.user.avatar) {
            return this.user.avatar;
        }

        const letters = this.displayName
            .split(' ')
            .slice(0, 2)
            .map(word => word[0])
            .join('');
        return `https://via.placeholder.com/64x64/74669b/ffffff?text=${letters}`;
    }

    public render() {
        const { chat } = this.props;
        const isActiveModifier = { active: ChatsStore.currentChat === chat };
        const isMine = this.message && this.message.senderId === UsersStore.currentUser.id;
        const isAttachment = this.message && this.message.attachment;

        return (
            <Link to={`/chats/${chat.id}`} className={`${b('item', isActiveModifier)}`}>
                <img src={this.avatar} alt="Аватар" className={b('dialog-image')} />
                <div className={b('dialog-body')}>
                    <div className={b('dialog-name')} title={this.displayName}>
                        {this.displayName}
                    </div>
                    {this.message && (
                        <div className={b('last-msg')}>
                            <span className={b('last-msg-mine')}>{isMine && 'Вы: '}</span>
                            {isAttachment && 'Фотография'}
                            {getPlainText(markdown(this.message.text))}
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
