import React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';

import './index.css';
import ItemDialog from './ItemDialog';
import ChatsStore from '../../domain/chats-store';

@observer
export default class Dialogs extends React.Component {
    static chatOrderComparator(chat1, chat2) {
        const time1 = chat1.lastMessage ? new Date(chat1.lastMessage.createdAt).getTime() : 0;
        const time2 = chat2.lastMessage ? new Date(chat2.lastMessage.createdAt).getTime() : 0;

        return time2 - time1;
    }

    // eslint-disable-next-line class-methods-use-this
    @computed get chats() {
        return ChatsStore.chats
            .filter(chat => !(chat.type === 'dialog' && chat.lastMessage === null))
            .sort(Dialogs.chatOrderComparator);
    }

    render() {
        return (
            <div className="dialogs">
                <div className="dialog-list">
                    {this.chats.map(dialog => (
                        <ItemDialog
                            key={dialog.id}
                            chat={dialog}
                        />
                    ))}
                </div>
            </div>
        );
    }
}
