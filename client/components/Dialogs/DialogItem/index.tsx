import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import b_ from 'b_';

import ChatsStore from '../../../domain/chats-store';
import UsersStore from '../../../domain/users-store';
import formatDate from '../../../utils/format-date';
import './DialogItem.css';

const b = b_.with('dialog-list');

interface Props {
    chat: any;
}

@observer
class DialogItem extends React.Component<Props> {
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
            const currentUsername = UsersStore.currentUser.username;
            const otherUsername = chat.members.filter(member => member !== currentUsername)[0];
            const otherUser = UsersStore.users.get(otherUsername || currentUsername);

            return otherUser || null;
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
            return `data:image/png;base64,${this.user.avatar}`;
        }

        const letter = this.props.chat.type === 'dialog' ? 'D' : 'R';
        return `https://via.placeholder.com/64x64?text=${letter}`;
    }

    public render() {
        const { chat } = this.props;
        const isActiveModifier = { active: ChatsStore.currentChat === chat };
        const isMine = this.message && this.message.from === UsersStore.currentUser.username;

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
                            {this.message.text}
                        </div>
                    )}
                </div>
                {this.message && (
                    <div className={b('last-msg-date')}>
                        {formatDate(this.message.createdAt)}
                    </div>
                )}
            </Link>
        );
    }
}

export default DialogItem;