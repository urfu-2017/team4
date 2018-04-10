import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { Link } from 'react-router-dom';

import './itemDialog.css';
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
        const user = UsersStore.currentUser;

        if (chat.type === 'room') {
            return UsersStore.users.get(chat.owner);
        }

        const other = chat.members.find(member => member !== user.username);
        return UsersStore.users.get(other);
    }

    render() {
        const { chat } = this.props;

        const chatName = chat.type === 'dialog' && this.user ? this.user.displayName : chat.name;
        const avatar = this.user && this.user.avatar && `data:image/png;base64,${this.user.avatar}`;
        const activeClassName = ChatsStore.currentChat === chat ? ' dialog-list__item--active' : '';

        return (
            <Link
                to={`/chats/${chat.id}`}
                className={`dialog-list__item ${activeClassName}`}
            >
                <img
                    src={avatar}
                    alt=""
                    className="dialog-list__dialog-image"
                />
                <div className="dialog-list__dialog-body">
                    <div className="dialog-list__dialog-name" title={chatName}>{chatName}</div>
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
