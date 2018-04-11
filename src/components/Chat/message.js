import React from 'react';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import UsersStore from '../../domain/users-store';
import UIStore from '../../domain/ui-store';
import markdown from '../../utils/markdown';
import formatDate from '../../utils/format-date';

import './index.css';

@observer
class Message extends React.Component {
    @computed get user() {
        const username = this.props.message.from;
        return UsersStore.users.get(username);
    }

    showUserProfile = (event) => {
        event.preventDefault();
        UIStore.toggleUserProfilePopup(this.user);
    }

    render() {
        const { from, text, createdAt } = this.props.message;
        const displayName = this.user ? this.user.displayName : from;
        const avatar = this.user ? `data:image/png;base64,${this.user.avatar}` :
            'https://api.adorable.io/avatars/128/abott@adorable.png';

        return (
            <div className="message">
                <img
                    onClick={this.showUserProfile}
                    className="message__avatar"
                    src={avatar}
                    alt="Аватар"
                />
                <div className="message__body">
                    <div className="message__username">{displayName}</div>
                    <div className="message__text" dangerouslySetInnerHTML={{ __html: markdown(text) }}/>
                </div>
                <div className="message__date">
                    <span className="message__date-value">{formatDate(createdAt)}</span>
                </div>
            </div>
        );
    }
}

Message.propTypes = {
    message: PropTypes.shape().isRequired
};

export default Message;
