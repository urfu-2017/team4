import React from 'react';
import { observer } from 'mobx-react';

import './index.css';
import ItemDialog from './ItemDialog';
import DialogSearch from './dialogSearch/dialogSearch';

import ChatsStore from '../../domain/chats-store';

@observer
export default class Dialogs extends React.Component {
    render() {
        return (
            <div className="dialogs">
                <DialogSearch/>
                <div className="dialog-list">
                    {ChatsStore.chats.map(dialog => (
                        <ItemDialog
                            key={dialog.id}
                            id={dialog.id}
                            name={dialog.name}
                            messagesIds={1}
                        />
                    ))}
                </div>
            </div>
        );
    }
}
