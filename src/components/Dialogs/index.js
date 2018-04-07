import React from 'react';

import './index.css';
import ItemDialog from './itemDialog/itemDialog';
import DialogSearch from './dialogSearch/dialogSearch';
import dialogs from './dialogs.json';

export default class Dialogs extends React.Component {
    render() {
        return (
            <div className="dialogs">
                <DialogSearch/>
                <div className="dialog-list">
                    {
                        dialogs.map(dialog => (
                            <ItemDialog
                                key={dialog.id}
                                name={dialog.name}
                                messagesIds={dialog.messagesIds}
                            />
                        ))
                    }
                </div>
            </div>
        );
    }
}
