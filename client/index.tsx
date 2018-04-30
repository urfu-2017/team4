import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import App from './components/App';
import LoaderPage from './components/LoaderPage';
import LoginPage from './components/LoginPage';
import './index.css';

import MobileApp from './components/MobileApp';
import ChatsStore from './domain/chats-store';
import UsersStore from './domain/users-store';
import RPC from './utils/rpc-client';

@observer
class Application extends React.Component {
    @observable private isAppLoaded = false;

    @observable private isAuthRequired = false;

    @observable private isMobile = false;

    private readonly matchMedia;

    constructor(props) {
        super(props);

        this.matchMedia = window.matchMedia('(max-width: 800px)');
        this.matchMedia.addListener(this.toggleMobileApp);
        this.toggleMobileApp(this.matchMedia);
    }

    public async componentDidMount() {
        try {
            console.time('init');
            console.time('ws');

            await RPC.connect();
            console.timeEnd('ws');

            await UsersStore.fetchCurrentUser();
            ChatsStore.init();

            console.timeEnd('init');
            this.isAppLoaded = true;
        } catch (e) {
            console.error(e);
            this.isAuthRequired = true;
            this.isAppLoaded = true;
        }
    }

    public toggleMobileApp = matchMedia => {
        this.isMobile = !!matchMedia.matches;
    };

    public render() {
        if (!this.isAppLoaded) {
            return <LoaderPage />;
        }

        if (this.isAuthRequired) {
            return <LoginPage />;
        }

        return <HashRouter>{this.isMobile ? <MobileApp /> : <App />}</HashRouter>;
    }
}

ReactDOM.render(<Application />, document.getElementById('root'));
