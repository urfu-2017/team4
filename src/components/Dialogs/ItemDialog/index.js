import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { Link } from 'react-router-dom';

import './ItemDialog.css';
import formatDate from '../../../utils/format-date';
import UsersStore from '../../../domain/users-store';
import ChatsStore from '../../../domain/chats-store';

@observer
class ItemDialog extends React.Component {
    @computed get message() {
        const { chat } = this.props;

        if (!chat || !chat.lastMessage) {
            return null;
        }

        return chat.lastMessage;
    }

    @computed get user() {
        const { chat } = this.props;

        if (chat.type === 'dialog') {
            const currentUsername = UsersStore.currentUser.username;
            const otherUsername = chat.members.filter(member => member !== currentUsername)[0];
            const otherUser = UsersStore.users.get(otherUsername || currentUsername);

            return otherUser || null;
        }

        return null;
    }

    @computed get displayName() {
        return this.user ? this.user.displayName : this.props.chat.name;
    }

    @computed get avatar() {
        if (this.user && this.user.avatar) {
            return `data:image/png;base64,${this.user.avatar}`;
        }

        const letter = this.props.chat.type === 'dialog' ? 'D' : 'R';
        return `https://via.placeholder.com/64x64?text=${letter}`;
    }

    render() {
        const { chat } = this.props;
        const activeClassName = ChatsStore.currentChat === chat ? ' dialog-list__item--active' : '';

        return (
            <Link
                to={`/chats/${chat.id}`}
                className={`dialog-list__item ${activeClassName}`}
            >
                <img
                    src={this.avatar}
                    alt=""
                    className="dialog-list__dialog-image"
                />
                <div className="dialog-list__dialog-body">
                    <div className="dialog-list__dialog-name" title={this.displayName}>{this.displayName}</div>
                    {this.message && <div className="dialog-list__last-msg">{this.message.text}</div>}
                </div>
                {this.message && (
                    <div className="dialog-list__last-msg-date">
                        {formatDate(this.message.createdAt)}
                    </div>
                )}
            </Link>
        );
    }
}

ItemDialog.propTypes = {
    chat: PropTypes.shape().isRequired
};

export default ItemDialog;
