import { observer } from 'mobx-react';
import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import Contacts from '../Contacts/Popup';
import ProfileSettings from '../Profile';
import UserProfile from '../UserProfile';
import './MobileApp.css';

import uiStore from '../../domain/ui-store';
import Chats from './Chats';
import MobileChat from './MobileChat';

@observer
class MobileApp extends React.Component {
    public renderModals() {
        return (
            <React.Fragment>
                {uiStore.displays.contacts && <Contacts />}
                {uiStore.displays.profile && <ProfileSettings />}
                {uiStore.displays.user && <UserProfile />}
            </React.Fragment>
        );
    }

    public render() {
        return (
            <div className="mobile-app">
                <Switch>
                    <Route path="/chats/:id" component={MobileChat} />
                    <Route path="/" component={Chats} />
                    <Redirect from="*" to="/" />
                </Switch>
                {this.renderModals()}
            </div>
        );
    }
}

export default withRouter(MobileApp as any);
