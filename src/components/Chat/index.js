import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

function goodDate(time) {
    const dt = new Date(time * 1000);
    const hours = dt.getHours();
    const minutes = `0${dt.getMinutes()}`;
    const seconds = `0${dt.getSeconds()}`;

    return `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
}

const Message = ({ username, text, avatar, date }) => {
    return (
        <div className="message">
            <img
                className="message__avatar"
                src={avatar}
                alt="Аватар"
                onClick={function () {
                    // Профиль пользователя
                }}
                />
            <div className="message__body">
                <span
                    className="message__username"
                    onClick={function () {
                        // Профиль пользователя
                    }}
                    >
                    {username}
                </span>
                <span className="message__text">
                    {text}
                </span>
            </div>
            <div className="message__date">
                <span className="message__date-value">
                    {goodDate(date)}
                </span>
            </div>
        </div>
    );
};

Message.propTypes = {
    username: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired
};

export default class Chat extends React.Component {
    render() {
        const messages = this.props.chatMessages.map(message => {
            return (
                <Message
                    key={message.id}
                    username={message.username}
                    text={message.text}
                    avatar={message.avatar}
                    date={message.date}
                    />
            );
        });

        return (
            <div className="chat">
                { messages }
            </div>
        );
    }
}

Chat.propTypes = {
    chatMessages: PropTypes.arrayOf(PropTypes.shape(Message.propTypes)).isRequired
};
