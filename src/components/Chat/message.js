import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

import formatDate from '../../utils/format-date';

class Message extends React.Component {
    render() {
        const { username, text, date } = this.props;

        return (
            <React.Fragment>
                <div className="message">
                    <img
                        className="message__avatar"
                        src="https://api.adorable.io/avatars/128/abott@adorable.png"
                        alt="Аватар"
                    />
                    <div className="message__body">
                        <div className="message__username">{username}</div>
                        <div className="message__text">{text}</div>
                    </div>
                    <div className="message__date">
                        <span className="message__date-value">{formatDate(date)}</span>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

Message.propTypes = {
    username: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired
};

export default Message;
