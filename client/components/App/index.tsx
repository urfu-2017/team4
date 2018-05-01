import { observer } from 'mobx-react';
import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import ChatWrapper from '../Chat/ChatWrapper';
import Contacts from '../Contacts';
import Chats from '../Chats';
import Header from '../Header';
import ProfileView from '../UserProfile';
import ProfileSettings from '../Profile/input';
import CreateRoom from '../Room';
import ChatInfo from '../ChatInfo';

import uiStore from '../../domain/ui-store';

import './App.css';

const stubComponent: React.SFC = () => <div />;

@observer
class App extends React.Component {
    public renderModals() {
        return (
            <React.Fragment>
                {uiStore.displays.contacts && <Contacts />}
                {uiStore.displays.profile && <ProfileSettings />}
                {uiStore.displays.chatInfo && <ChatInfo />}
                {uiStore.displays.userInfo && <ProfileView />}
                {uiStore.displays.createRoom && <CreateRoom />}
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
