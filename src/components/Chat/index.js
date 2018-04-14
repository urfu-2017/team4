import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import ChatView from 'react-chatview';

import Message from './message';
import './index.css';

import ChatsStore from '../../domain/chats-store';
import Preloader from '../Preloader';

@observer
export default class Chat extends React.Component {
    // eslint-disable-next-line class-methods-use-this
    @computed get chat() {
        return ChatsStore.currentChat;
    }

    shouldLoadHistory = () => this.chat.canLoadNextHistoryFrame

    loadHistory = async () => {
        if (this.shouldLoadHistory()) {
            await this.chat.loadNextHistoryFrame();
        }
    }

    render() {
        return (
            <ChatView
                className="chat"
                scrollLoadThreshold={100}
                onInfiniteLoad={this.loadHistory}
                shouldTriggerLoad={this.shouldLoadHistory}
                loadingSpinnerDelegate={<Preloader size={36} className="chat__preloader"/>}
                flipped
                reversed
            >
                {ChatsStore.currentChat.messages.map(message => (
                    <Message key={message.id} message={message}/>
                ))}
            </ChatView>
        );
    }
}
