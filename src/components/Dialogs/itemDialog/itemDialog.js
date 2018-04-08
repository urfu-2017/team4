/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import './itemDialog.css';
import formatDate from '../../../utils/format-date';

import ChatsStore from '../../../domain/chats-store';

@observer
class ItemDialog extends React.Component {
    selectDialog = (event) => {
        event.preventDefault();
        ChatsStore.setCurrentChat(this.props.id);
    }

    renderLastMessage() {
        const chat = ChatsStore.chatsMap.get(this.props.id);

        if (!chat || !chat.lastMessage) {
            return null;
        }

        const message = chat.lastMessage;

        return (
            <React.Fragment>
                <div className="dialog-list__last-msg">{message.text}</div>
                <div className="dialog-list__last-msg-date">{formatDate(message.createdAt)}</div>
            </React.Fragment>
        );
    }

    render() {
        const { name, id } = this.props;
        const isActive = ChatsStore.currentChat && ChatsStore.currentChat.id === id;

        const className = `dialog-list__item ${isActive ? 'dialog-list__item--active' : ''}`;

        return (
            <div className={className.trim()} onClick={this.selectDialog} role="article">
                <img
                    src="https://imagineacademy.microsoft.com/content/images/microsoft-img.png"
                    alt=""
                    className="dialog-list__dialog-image"
                />
                <div className="dialog-list__dialog-name">{name}</div>
                {this.renderLastMessage()}
            </div>
        );
    }
}

ItemDialog.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

export default ItemDialog;
