import React from 'react';
import PropTypes from 'prop-types';

import markdown from '../../utils/markdown';

import './index.css';
import formatDate from '../../utils/format-date';

const Message = ({ username, text, date }) => (
    <div className="message">
        <img
            className="message__avatar"
            src="https://api.adorable.io/avatars/128/abott@adorable.png"
            alt="Аватар"
        />
        <div className="message__body">
            <div className="message__username">{username}</div>
            <div className="message__text" dangerouslySetInnerHTML={{ __html: markdown(text) }}/>
        </div>
        <div className="message__date">
            <span className="message__date-value">{formatDate(date)}</span>
        </div>
    </div>
);

Message.propTypes = {
    username: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired
};

export default Message;
