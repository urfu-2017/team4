import React from 'react';
import PropTypes from 'prop-types';

import Message from './message';
import './index.css';

export default class Chat extends React.Component {
    render() {
        const messages = this.props.chatMessages.map(function(message) {
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
