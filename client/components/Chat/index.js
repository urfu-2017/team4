import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import ChatView from 'react-chatview';

import Message from './Message';
import './Chat.css';

import ChatsStore from '../../domain/chats-store';
import Preloader from '../Preloader';

@observer
class Chat extends React.Component {
    shouldLoadHistory = () => this.props.chat.canLoadNextHistoryFrame;

    loadHistory = async () => {
        if (this.shouldLoadHistory()) {
            await this.props.chat.loadNextHistoryFrame();
        }
    };

    render() {
        return (
            <ChatView
                className="chat"
                scrollLoadThreshold={100}
                onInfiniteLoad={this.loadHistory}
                shouldTriggerLoad={this.shouldLoadHistory}
                loadingSpinnerDelegate={<Preloader size={36} className="chat__preloader" />}
                flipped
                reversed
            >
                {ChatsStore.currentChat.messages.map(message => (
                    <Message key={message.id} message={message} />
                ))}
            </ChatView>
        );
    }
}

Chat.propTypes = {
    chat: PropTypes.shape().isRequired
};

export default Chat;
