import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import ChatView from 'react-chatview';

import Message from './message';
import './index.css';

import ChatsStore from '../../domain/chats-store';

@observer
export default class Chat extends React.Component {
    // eslint-disable-next-line class-methods-use-this
    @computed get chat() {
        return ChatsStore.currentChat;
    }

    shouldLoadHistory = () => this.chat.canLoadHistory

    loadHistory = async () => {
        if (this.shouldLoadHistory()) {
            await this.chat.loadHistory();
        }
    }

    render() {
        return (
            <ChatView
                className="chat"
                scrollLoadThreshold={100}
                onInfiniteLoad={this.loadHistory}
                shouldTriggerLoad={this.shouldLoadHistory}
                flipped
                reversed
            >
                {ChatsStore.currentChat.messages.map(message => (
                    <Message
                        key={message.id}
                        username={message.from}
                        text={message.text}
                        avatar={message.avatar}
                        date={message.createdAt}
                    />
                ))}
            </ChatView>
        );
    }
}
