import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';

import './index.css';

import ItemDialog from './ItemDialog';
import ChatsStore from '../../domain/chats-store';

import ButtonNewDialog from '../Button';

import uiStore from '../../domain/ui-store';

@observer
export default class Dialogs extends React.Component {
    static chatOrderComparator(chat1, chat2) {
        const time1 = chat1.lastMessage ? new Date(chat1.lastMessage.createdAt).getTime() : 0;
        const time2 = chat2.lastMessage ? new Date(chat2.lastMessage.createdAt).getTime() : 0;

        return time2 - time1;
    }

    onContactsClick = (event) => {
        event.preventDefault();
        uiStore.togglePopup('contacts')();
    };

    // eslint-disable-next-line class-methods-use-this
    @computed get chats() {
        return ChatsStore.chats
            .filter(chat => !(chat.type === 'dialog' && chat.lastMessage === null))
            .sort(Dialogs.chatOrderComparator);
    }

    render() {
        const { currentChat } = ChatsStore;
        const isExists = currentChat && !!this.chats.find(chat => chat.id === currentChat.id);

        return (
            <div className="dialogs">
                <div className="dialog-list">
                    {currentChat && !isExists && <ItemDialog chat={currentChat}/>}
                    {this.chats.map(dialog => (
                        <ItemDialog
                            key={dialog.id}
                            chat={dialog}
                        />
                    ))}
                </div>
                <ButtonNewDialog
                    onClick={this.onContactsClick}
                    className="dialogs__new-dialog-btn"
                    type="main"
                >
                    Новый диалог
                </ButtonNewDialog>
            </div>
        );
    }
}
