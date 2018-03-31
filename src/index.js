import React from 'react';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import './index.css';
import './hacks.css';
import LoginPage from './components/LoginPage';
import * as RPCClient from './utils/rpc-client';

@observer
class Application extends React.Component {
    async componentDidMount() {
        try {
            await RPCClient.connect();
            const user = await RPCClient.request('fetchUser');
            this.user = user;
            this.name = `${user.firstName} ${user.lastName}`;
            this.isAppLoaded = true;
        } catch (e) {
            this.isAuthRequired = true;
            this.isAppLoaded = true;
        }
    }

    @observable isAppLoaded = false;
    @observable isAuthRequired = false;
    @observable name;
    @observable user;

    render() {
        if (!this.isAppLoaded) {
            return (<div/>);
        }

        if (this.isAuthRequired) {
            return <LoginPage/>;
        }

        return (
            <div>
                <h1>Hello {this.name}</h1>
                <pre style={{ fontSize: '16px' }}>{JSON.stringify(this.user, null, 2)}</pre>
            </div>
        );
    }
}

ReactDOM.render(<Application/>, document.getElementById('root'));
