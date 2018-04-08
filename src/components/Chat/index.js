import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Message from './message';
import './index.css';

import ChatsStore from '../../domain/chats-store';

@observer
export default class Chat extends React.Component {
    render() {
        const messages = ChatsStore.currentChat.messages.map(message => (
            <Message
                key={message.id}
                username={message.from}
                text={message.text}
                avatar={message.avatar}
                date={message.createdAt}
            />
        ));

        return (<div className="chat">{messages}</div>);
    }
}

Chat.propTypes = {
};
