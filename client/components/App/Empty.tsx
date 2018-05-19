import React from 'react';
import { Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';

import uiStore from '../../domain/ui-store';
import chatsStore from '../../domain/chats-store';

@observer
class Empty extends React.Component {

    public render(): React.ReactNode {
        const redirectUrl = this.getRedirectUrl();

        if (redirectUrl) {
            return <Redirect to={redirectUrl}/>
        }

        const className = `empty ${uiStore.isDark ? 'empty_dark' : ''}`.trim();

        return (
            <div className={className}>
                <h2 className="empty__header header2">
                    {chatsStore.chats.length === 0 ? (
                        <span className="empty__action" onClick={this.onOpenContacts}>
                            Создайте свой первый диалог с кем-нибудь из своих контактов
                        </span>
                    ) : 'Для начала общения выберите чат'}
                </h2>
            </div>
        )
    }

    private onOpenContacts = () => {
        uiStore.togglePopup('contacts')();
    }

    private getRedirectUrl(): string {
        try {
            const url = localStorage.getItem('redirect');
            localStorage.removeItem('redirect');
            return url;
        } catch (e) {
            return '';
        }
    }

}

export default Empty;
