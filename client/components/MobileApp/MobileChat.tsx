import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import ChatsStore from '../../domain/chats-store';
import UsersStore from '../../domain/users-store';
import Chat from '../Chat/';
import backArrow from './back-arrow.svg';
import MessageInput from './MobileMessageInput';

class MobileChat extends React.Component<RouteComponentProps<{ id: string }>> {
    public componentWillMount() {
        // eslint-disable-next-line react/prop-types
        const chatId = this.props.match.params.id;
        this.setCurrentChat(chatId);
    }

    public componentWillReceiveProps(nextProps) {
        const oldChatId = this.props.match.params.id;
        const newChatId = nextProps.match.params.id;

        if (oldChatId !== newChatId) {
            this.setCurrentChat(newChatId);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    public setCurrentChat(chatId) {
        const chat = ChatsStore.chatsMap.has(chatId);

        if (!chat) {
            // eslint-disable-next-line react/prop-types
            this.props.history.replace('/');
            return;
        }

        ChatsStore.setCurrentChat(chatId);
    }

    public backToDialogs = event => {
        event.preventDefault();
        // eslint-disable-next-line react/prop-types
        this.props.history.push('/');
    };

    public render() {
        const chat = ChatsStore.currentChat;
        let message = 'Выберите чат';

        if (chat.type === 'dialog') {
            const currentUsername = UsersStore.currentUser.username;
            const otherUsername = chat.members.filter(member => member !== currentUsername)[0];
            const otherUser = UsersStore.users.get(otherUsername || currentUsername);

            message = otherUser.displayName;
        } else {
            message = `${chat.name} (${chat.members.length} участников)`;
        }

        return (
            <React.Fragment>
                <header className="mobile-app__header header">
                    <div className="header__main-wrap">
                        <img
                            className="back-arrow"
                            src={backArrow}
                            alt=""
                            onClick={this.backToDialogs}
                        />
                        <div className="header__chat-name">{message}</div>
                    </div>
                </header>
                <div className="mobile-app__container">
                    <Chat chat={chat} />
                    <MessageInput />
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(MobileChat);
