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

@observer
class Application extends React.Component {
    async componentDidMount() {
        try {
            await RPC.connect();
            await UsersStore.fetchCurrentUser();
            await RPC.request('joinToDialog', { dialog: this.chatId });
            RPC.addListener('newMessage', this.onNewMessage);
            this.isAppLoaded = true;
        } catch (e) {
            console.info(e);
            this.isAuthRequired = true;
            this.isAppLoaded = true;
        }

        this.messages = await RPC.request('fetchHistory', { chatId: this.chatId });
    }

    onSend = async (text) => {
        const response = await RPC.request('sendMessage', { chatId: this.chatId, text }, 15000);
        this.messages.push(response);
    };

    onNewMessage = (message) => {
        this.messages.push(message);
    }

    @observable isAppLoaded = false;
    @observable isAuthRequired = false;
    @observable messages = [];
    chatId = 'b5e0a205-ae0d-4107-a051-dff22bd4ae86';

    render() {
        if (!this.isAppLoaded) {
            return (<div/>);
        }

        if (this.isAuthRequired) {
            return <LoginPage/>;
        }

        const user = UsersStore.currentUser;
        const name = `${user.firstName} ${user.lastName}`.trim() || user.username;

        return (
            <App/>
        );
    }
}

ReactDOM.render(<Application/>, document.getElementById('root'));
