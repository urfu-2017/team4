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

import ChatsStore from '../../domain/chats-store';

@observer
class App extends React.Component {
    render() {
        return (
            <div className="app">
                <Header/>
                <Dialogs/>

                <div className="chat-wrapper">
                    {ChatsStore.currentChat !== null ? (
                        <React.Fragment>
                            <Chat chatMessages={messageList}/>
                            <MessageInput/>
                        </React.Fragment>
                    ) : <div className="chat-stub"/>}
                </div>

                { uiStore.displays.contacts && <Contacts/> }
            </div>
        );
    }
}

export default App;
