import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import b from 'b_';

import Chat from '../Chat';
import MessageInput from '../MessageInput';
import './Chat.css';

import ChatsStore from '../../domain/chats-store';
import ApplicationStore from '../../domain/application-store';
import uiStore from '../../domain/ui-store';

interface Props extends RouteComponentProps<{ id: string }> {}

@observer
class ChatWrapper extends React.Component<Props> {
    public componentWillMount() {
        const chatId = this.props.match.params.id;
        this.setCurrentChat(chatId);
    }

    public componentWillReceiveProps(nextProps) {
        const oldChatId = this.props.match.params.id;
        const newChatId = nextProps.match.params.id;

        if (oldChatId !== newChatId) {
            uiStore.setForwardMessage(null);
            this.setCurrentChat(newChatId);
        }
    }

    @computed
    get chat() {
        return ChatsStore.currentChat;
    }

    public setCurrentChat(chatId) {
        const chat = ChatsStore.chatsMap.has(chatId);

        if (!chat) {
            this.props.history.replace('/');
            return;
        }

        ChatsStore.setCurrentChat(chatId);
    }

    public render() {
        if (this.chat === null) {
            return <Redirect to={'/'} />;
        }

        const dark = uiStore.isDark;

        return (
            <div className={b('chat-wrapper', { dark })}>
                <Chat chat={this.chat} />
                <MessageInput key={this.chat.id} />
                {ApplicationStore.isOffline && this.renderOfflineWarning()}
            </div>
        );
    }

    private renderOfflineWarning() {
        return (
            <div className="chat-wrapper__offline">
                Нет соединения с сервером
            </div>
        )
    }
}

export default ChatWrapper;
