import React from 'react';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import './index.css';
import './hacks.css';
import LoginPage from './components/LoginPage';
import RPC from './utils/rpc-client';
import UsersStore from './domain/users-store';

@observer
class Application extends React.Component {
    async componentDidMount() {
        try {
            await RPC.connect();
            await UsersStore.fetchCurrentUser();
            this.isAppLoaded = true;
        } catch (e) {
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

        return (
            <pre style={{ fontSize: '16px' }}>{JSON.stringify(UsersStore.currentUser, null, 2)}</pre>
        );
    }
}

ReactDOM.render(<Application/>, document.getElementById('root'));
