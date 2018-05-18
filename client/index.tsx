import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

import { observer } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import App from './components/App';
import LoaderPage from './components/LoaderPage';
import LoginPage from './components/LoginPage';

import uiStore from './domain/ui-store';

import registerServiceWorker from './registerServiceWorker';
import applicationStore from './domain/application-store';
import './index.css';

registerServiceWorker();
Notification.requestPermission();

@observer
class Application extends React.Component {
    public componentDidMount() {
        applicationStore.init();

        if (uiStore.isDark) {
            document.body.style.backgroundColor = '#545b5f';
        }
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
