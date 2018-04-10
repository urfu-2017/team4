import React from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';

import Header from '../Header';
import Dialogs from '../Dialogs';
import Contacts from '../Contacts';
import ChatWrapper from '../Chat/ChatWrapper';
import Profile from '../Profile';
import './App.css';

import uiStore from '../../domain/ui-store';

@observer
class App extends React.Component {
    renderModals() {
        return (
            <React.Fragment>
                {uiStore.displayContacts && <Contacts closeContacts={uiStore.toggleContacts}/>}
                {uiStore.displayProfile && <Profile closeProfile={uiStore.toggleProfile}/>}
            </React.Fragment>
        );
    }

    render() {
        return (
            <HashRouter>
                <div className="app">
                    <Header/>
                    <Dialogs/>
                    <div className="chat-wrapper">
                        <Switch>
                            <Route path="/chats/:id" component={ChatWrapper}/>
                            <Route path="/" render={() => <div/>}/>
                            <Redirect from="*" to="/"/>
                        </Switch>
                    </div>
                    {this.renderModals()}
                </div>
            </HashRouter>
        );
    }
}

export default App;
