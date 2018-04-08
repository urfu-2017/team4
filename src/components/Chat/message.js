import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import UsersStore from '../../domain/users-store';
import markdown from '../../utils/markdown';
import formatDate from '../../utils/format-date';

import './index.css';

@observer
class Message extends React.Component {
    render() {
        const { from, text, createdAt } = this.props.message;
        const user = UsersStore.users.get(from);
        const displayName = user ? user.displayName : from;
        const avatar = user ? `data:image/png;base64,${user.avatar}` :
            'https://api.adorable.io/avatars/128/abott@adorable.png';

        return (
            <div className="message">
                <img
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
