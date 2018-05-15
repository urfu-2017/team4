import { observer } from 'mobx-react';
import React from 'react';
import ChatView from 'react-chatview';
import b from 'b_';

import ChatsStore from '../../domain/chats-store';
import Preloader from '../Preloader';
import Messages from './Messages';

import uiStore from '../../domain/ui-store';

import './Chat.css';

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
        const dark = uiStore.isDark;

        return (
            <ChatView
                className={b('chat', { dark })}
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
