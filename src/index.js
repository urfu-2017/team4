import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import './index.css';
import './hacks.css';
import App from './components/App';
import LoginPage from './components/LoginPage';
import LoaderPage from './components/LoaderPage';

import RPC from './utils/rpc-client';
import UsersStore from './domain/users-store';
import ChatsStore from './domain/chats-store';
import MobileApp from './components/MobileApp';

window.RPC = RPC;

@observer
class Application extends React.Component {
    constructor(props) {
        super(props);

        this.matchMedia = window.matchMedia('(max-width: 800px)');
        this.matchMedia.addListener(this.toggleMobileApp);
        this.toggleMobileApp(this.matchMedia);
    }

    async componentDidMount() {
        try {
            await RPC.connect();
            await UsersStore.fetchCurrentUser();
            await ChatsStore.init();

            this.isAppLoaded = true;
        } catch (e) {
            console.error(e);
            this.isAuthRequired = true;
            this.isAppLoaded = true;
        }
    }

    toggleMobileApp = (matchMedia) => {
        this.isMobile = !!matchMedia.matches;
    }

    @observable isAppLoaded = false;
    @observable isAuthRequired = false;
    @observable isMobile = false;

    render() {
        if (!this.isAppLoaded) {
            return (<LoaderPage/>);
        }

        if (this.isAuthRequired) {
            return <LoginPage/>;
        }

        return (
            <HashRouter>
                {this.isMobile ? <MobileApp/> : <App/>}
            </HashRouter>
        );
    }
}

ReactDOM.render(<Application/>, document.getElementById('root'));
