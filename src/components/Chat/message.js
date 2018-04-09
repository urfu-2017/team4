import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import markdown from '../../utils/markdown';

import './index.css';
import formatDate from '../../utils/format-date';

const Message = observer(({ message }) => {
    const { from, text, createdAt } = message;

    return (
        <div className="message">
            <img
                className="message__avatar"
                src="https://api.adorable.io/avatars/128/abott@adorable.png"
                alt="Аватар"
            />
            <div className="message__body">
                <div className="message__username">{from}</div>
                <div className="message__text" dangerouslySetInnerHTML={{ __html: markdown(text) }}/>
            </div>
            <div className="message__date">
                <span className="message__date-value">{formatDate(createdAt)}</span>
            </div>
        </div>
    );
});

Message.propTypes = {
    message: PropTypes.shape().isRequired
};

export default Message;
