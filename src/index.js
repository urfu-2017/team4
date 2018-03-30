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
            const response = await RPCClient.request('fetchUser');
            this.name = response.displayName;
            this.isAppLoaded = true;
        } catch (e) {
            this.isRequiredAuth = true;
            this.isAppLoaded = true;
        }
    }

    @observable isAppLoaded = false;
    @observable isRequiredAuth = false;
    @observable name;

    render() {
        if (!this.isAppLoaded) {
            return (<div/>);
        }

        if (this.isRequiredAuth) {
            return <LoginPage/>;
        }

        return (<h1>Hello {this.name}</h1>);
    }
}

ReactDOM.render(<Application/>, document.getElementById('root'));
