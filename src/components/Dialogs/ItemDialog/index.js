/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { computed } from 'mobx';

import './itemDialog.css';
import formatDate from '../../../utils/format-date';

import ChatsStore from '../../../domain/chats-store';

@observer
class ItemDialog extends React.Component {
    @computed get message() {
        const chat = ChatsStore.chatsMap.get(this.props.id);

        if (!chat || !chat.lastMessage) {
            return null;
        }

        return chat.lastMessage;
    }

    selectDialog = (event) => {
        event.preventDefault();
        ChatsStore.setCurrentChat(this.props.id);
    }

    render() {
        const { name, id } = this.props;
        const isActive = ChatsStore.currentChat && ChatsStore.currentChat.id === id;

        const className = `dialog-list__item ${isActive ? 'dialog-list__item--active' : ''}`;

        return (
            <div className={className.trim()} onClick={this.selectDialog} role="article">
                <img
                    src="https://api.adorable.io/avatars/128/abott@adorable.png"
                    alt=""
                    className="dialog-list__dialog-image"
                />
                <div className="dialog-list__dialog-body">
                    <div className="dialog-list__dialog-name">{name}</div>
                    {this.message && <div className="dialog-list__last-msg">{this.message.text}</div>}
                </div>
                {this.message && (
                    <div className="dialog-list__last-msg-date">
                        {formatDate(this.message.createdAt)}
                    </div>
                )}
            </div>
        );
    }
}

ItemDialog.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

export default ItemDialog;
