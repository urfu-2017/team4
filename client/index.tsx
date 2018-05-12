import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

import { observer } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import App from './components/App';
import LoaderPage from './components/LoaderPage';
import LoginPage from './components/LoginPage';

import applicationStore from './domain/application-store';
import './index.css';

// Если есть сервис воркер, то запрашивает права на уведомления
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
    Notification.requestPermission();
}

@observer
class Application extends React.Component {
    public componentDidMount() {
        applicationStore.init();
    }

    public render() {
        const { isAppLoaded, isAuthRequired } = applicationStore;

        if (!isAppLoaded) {
            return <LoaderPage />;
        }

        if (isAuthRequired) {
            return <LoginPage />;
        }

        return (
            <HashRouter>
                <App />
            </HashRouter>
        );
    }
}

ReactDOM.render(<Application />, document.getElementById('root'));
