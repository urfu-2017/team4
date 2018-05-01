import { observer } from 'mobx-react';
import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import ChatWrapper from '../Chat/ChatWrapper';
import Contacts from '../Contacts/index';
import Chats from '../Chats';
import Header from '../Header';
import ProfileSettings from '../Profile';
import UserProfile from '../UserProfile';
import CreateRoom from '../CreateRoom';
import './App.css';

import uiStore from '../../domain/ui-store';

const stubComponent: React.SFC = () => <div />;

@observer
class App extends React.Component {
    public renderModals() {
        return (
            <React.Fragment>
                {uiStore.displays.contacts && <Contacts />}
                {uiStore.displays.profile && <ProfileSettings />}
                {uiStore.displays.user && <UserProfile />}
                {uiStore.displays.createRoom && <CreateRoom/>}
            </React.Fragment>
        );
    }

    public render() {
        return (
            <HashRouter>
                <div className="app">
                    <Header />
                    <Chats />
                    <div className="content">
                        <Switch>
                            <Route path="/chats/:id" component={ChatWrapper} />
                            <Route path="/" component={stubComponent} />
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
