import React from 'react';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import './index.css';
import './hacks.css';
import App from './components/App';
import LoginPage from './components/LoginPage';
import RPC from './utils/rpc-client';
import UsersStore from './domain/users-store';

import MessageInput from './components/MessageInput';
import Chat from './components/Chat';
import ChatModel from './domain/chat-model';

window.RPC = RPC;

@observer
class Application extends React.Component {
    async componentDidMount() {
        try {
            await RPC.connect();
            await UsersStore.fetchCurrentUser();
            RPC.addListener('newMessage', this.onNewMessage);
            this.isAppLoaded = true;
        } catch (e) {
            console.info(e);
            this.isAuthRequired = true;
            this.isAppLoaded = true;
        }

        const chats = await RPC.request('fetchDialogs');

        chats.forEach(async (chat) => {
            const chatModel = new ChatModel(chat);
            await chatModel.join();
            this.chats.set(chat.id, chatModel);
        });
    }

    onSend = async (text) => {
        await this.currentChat.sendMessage(text);
    };

    onNewMessage = (message) => {
        const { chatId } = message;
        const chat = this.chats.get(chatId);

        if (chat) {
            chat.onRecieveMessage(message);
        }
    }

    onChangeCurrentChat = (event) => {
        const chatId = event.currentTarget.value;
        this.currentChat = this.chats.get(chatId);
    }

    @observable isAppLoaded = false;
    @observable isAuthRequired = false;
    @observable currentChat = null;
    @observable chats = new Map();

    renderChooser() {
        return (
            <select onChange={this.onChangeCurrentChat}>
                <option>-</option>
                {Array.from(this.chats.values()).map(chat => (
                    <option value={chat.id} key={chat.id}>{chat.name}</option>
                ))}
            </select>
        );
    }

    render() {
        if (!this.isAppLoaded) {
            return (<div/>);
        }

        if (this.isAuthRequired) {
            return <LoginPage/>;
        }

        return (<App/>);
    }
}

ReactDOM.render(<Application/>, document.getElementById('root'));
