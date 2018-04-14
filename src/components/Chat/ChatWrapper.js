import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import './Chat.css';
import Chat from '../Chat';
import MessageInput from '../MessageInput';

import ChatsStore from '../../domain/chats-store';

@observer
class ChatWrapper extends React.Component {
    componentWillMount() {
        // eslint-disable-next-line react/prop-types
        const chatId = this.props.match.params.id;
        this.setCurrentChat(chatId);
    }

    componentWillReceiveProps(nextProps) {
        const oldChatId = this.props.match.params.id;
        const newChatId = nextProps.match.params.id;

        if (oldChatId !== newChatId) {
            this.setCurrentChat(newChatId);
        }
    }

    @computed get chat() {
        return ChatsStore.currentChat;
    }

    // eslint-disable-next-line class-methods-use-this
    setCurrentChat(chatId) {
        const chat = ChatsStore.chatsMap.has(chatId);

        if (!chat) {
            // eslint-disable-next-line react/prop-types
            this.props.history.replace('/');
            return;
        }

        ChatsStore.setCurrentChat(chatId);
    }

    render() {
        if (this.chat === null) {
            return null;
        }

        return (
            <div className="chat-wrapper">
                <Chat chat={this.chat}/>
                <MessageInput key={this.chat.id}/>
            </div>
        );
    }
}

export default ChatWrapper;
