import React from 'react';
import PropTypes from 'prop-types';

import './index.css';
import formatDate from '../../utils/format-date';

const Message = ({ username, text, avatar, date }) => (
    <div className="message">
        <img
            className="message__avatar"
            src={avatar}
            alt="Аватар"
        />
        <div className="message__body">
            <span className="message__username">
                {username}
            </span>
            <span className="message__text">
                {text}
            </span>
        </div>
        <div className="message__date">
            <span className="message__date-value">
                {formatDate(date)}
            </span>
        </div>
    </div>
);

Message.propTypes = {
    username: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired
};

export default Message;
