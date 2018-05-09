import { observer } from 'mobx-react';
import React from 'react';
import ChatView from 'react-chatview';

import './Chat.css';
import Message from '../Message';

import ChatsStore from '../../domain/chats-store';
import Preloader from '../Preloader';
import Messages from './Messages';

interface Props {
    chat: any;
}

@observer
class Chat extends React.Component<Props> {
    public shouldLoadHistory = () => this.props.chat.canLoadNextHistoryFrame;

    public loadHistory = async () => {
        if (this.shouldLoadHistory()) {
            await this.props.chat.loadNextHistoryFrame();
        }
    };

    public render() {
        return (
            <ChatView
                className="chat"
                scrollLoadThreshold={100}
                onInfiniteLoad={this.loadHistory}
                shouldTriggerLoad={this.shouldLoadHistory}
                loadingSpinnerDelegate={<Preloader size={36} className="chat__preloader" />}
                flipped={true}
                reversed={true}
            >
                <Messages
                    messages={[
                        ...ChatsStore.currentChat.messages,
                        ...ChatsStore.currentChat.sendingMessages
                    ]}
                />
            </ChatView>
        );
    }
}

export default Chat;
