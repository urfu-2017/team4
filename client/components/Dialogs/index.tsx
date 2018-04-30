import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import './Dialogs.css';

import ChatsStore from '../../domain/chats-store';
import DialogItem from './DialogItem';

import Button from '../Button';

import uiStore from '../../domain/ui-store';

@observer
class Dialogs extends React.Component {
    public static chatOrderComparator(chat1, chat2) {
        const time1 = chat1.lastMessage ? new Date(chat1.lastMessage.createdAt).getTime() : 0;
        const time2 = chat2.lastMessage ? new Date(chat2.lastMessage.createdAt).getTime() : 0;

        return time2 - time1;
    }

    public onContactsClick = event => {
        event.preventDefault();
        uiStore.togglePopup('contacts')();
    };

    @computed
    get chats() {
        return ChatsStore.chats
            .filter(chat => !(chat.type === 'dialog' && chat.lastMessage === null))
            .sort(Dialogs.chatOrderComparator);
    }

    public render() {
        const { currentChat } = ChatsStore;
        const isExists = currentChat && !!this.chats.find(chat => chat.id === currentChat.id);

        return (
            <div className="dialogs">
                <div className="dialog-list">
                    {currentChat && !isExists && <DialogItem chat={currentChat} />}
                    {this.chats.map(dialog => <DialogItem key={dialog.id} chat={dialog} />)}
                </div>
                <Button
                    onClick={this.onContactsClick}
                    className="dialogs__new-dialog-btn"
                    type="main"
                >
                    Новый диалог
                </Button>
            </div>
        );
    }
}

export default Dialogs;
