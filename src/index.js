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
import ChatsStore from './domain/chats-store';

window.RPC = RPC;

@observer
class Application extends React.Component {
    async componentDidMount() {
        try {
            await RPC.connect();
            await UsersStore.fetchCurrentUser();
            await ChatsStore.init();

            this.isAppLoaded = true;
        } catch (e) {
            console.info(e);
            this.isAuthRequired = true;
            this.isAppLoaded = true;
        }
    }

    @observable isAppLoaded = false;
    @observable isAuthRequired = false;

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
