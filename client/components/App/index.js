import React from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';

import Header from '../Header';
import Dialogs from '../Dialogs';
import Contacts from '../Contacts';
import ChatWrapper from '../Chat/ChatWrapper';
import ProfileSettings from '../Profile';
import UserProfile from '../UserProfile';
import './App.css';

import uiStore from '../../domain/ui-store';

@observer
class App extends React.Component {
    renderModals() {
        return (
            <React.Fragment>
                {uiStore.displays.contacts && <Contacts />}
                {uiStore.displays.profile && <ProfileSettings />}
                {uiStore.displays.user && <UserProfile />}
            </React.Fragment>
        );
    }

    render() {
        return (
            <HashRouter>
                <div className="app">
                    <Header />
                    <Dialogs />
                    <div className="content">
                        <Switch>
                            <Route path="/chats/:id" component={ChatWrapper} />
                            <Route path="/" render={() => <div />} />
                            <Redirect from="*" to="/" />
                        </Switch>
                    </div>
                    {this.renderModals()}
                </div>
            </HashRouter>
        );
    }
}

export default App;
