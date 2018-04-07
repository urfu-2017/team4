import React from 'react';
import { observer } from 'mobx-react';

import Chat from '../Chat';
import Header from '../Header';
import Dialogs from '../Dialogs';
import Contacts from '../Contacts';
import MessageInput from '../MessageInput';
import './App.css';

import uiStore from '../../domain/ui-store';
import messageList from '../../fixtures/messageList.json';

@observer
class App extends React.Component {
    render() {
        return (
            <div className="app">
                <Header/>
                <Dialogs/>
                <div className="chat-wrapper">
                    <Chat chatMessages={messageList}/>
                    <MessageInput/>
                </div>
                {
                    uiStore.displayContacts &&
                    <Contacts closeContacts={uiStore.toggleContacts}/>
                }
            </div>
        );
    }
}

export default App;
