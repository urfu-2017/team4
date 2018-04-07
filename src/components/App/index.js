import React from 'react';
import { observer } from 'mobx-react';

import Chat from '../Chat';
import Header from '../Header';
import Dialogs from '../Dialogs';
import Contacts from '../Contacts';
import MessageInput from '../MessageInput';
import './App.css';

import appStore from '../../domain/app-store';
import messageList from '../../fixtures/messageList.json';

@observer
class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Header/>
                <Dialogs/>
                <div className="chat-wrapper">
                    <Chat chatMessages={messageList}/>
                    <MessageInput/>
                </div>
                {
                    appStore.displayAddContact &&
                    <Contacts closeContacts={appStore.toggleAddContact}/>
                }
            </React.Fragment>
        );
    }
}

export default App;
