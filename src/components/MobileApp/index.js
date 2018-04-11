import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Contacts from '../Contacts';
import ProfileSettings from '../Profile';
import UserProfile from '../UserProfile';
import './MobileApp.css';

import Chats from './Chats';
import uiStore from '../../domain/ui-store';
import MobileChat from './MobileChat';

class MobileApp extends React.Component {
    renderModals() {
        return (
            <React.Fragment>
                {uiStore.displays.contacts && <Contacts/>}
                {uiStore.displays.profile && <ProfileSettings/>}
                {uiStore.displays.user && <UserProfile/>}
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className="mobile-app">
                <Switch>
                    <Route path="/chats/:id" component={MobileChat}/>
                    <Route path="/" component={Chats}/>
                    <Redirect from="*" to="/"/>
                </Switch>
                {this.renderModals()}
            </div>
        );
    }
}

export default MobileApp;
