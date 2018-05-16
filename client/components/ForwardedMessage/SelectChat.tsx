import React from 'react';
import b_ from 'b_';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import Popup from '../Popup';
import uiStore from '../../domain/ui-store';
import chatsStore from '../../domain/chats-store';

import './SelectChat.css';
import Button from '../Button';
import createForwardMessage from '../../utils/createForwardMessage';
const b = b_.with('select-chat');

@observer
class SelectChat extends React.Component<RouteComponentProps<{}>> {
    private static closePopup() {
        uiStore.setForwardMessage(null);
        uiStore.togglePopup('selectChat')();
    }

    @computed
    private get chats() {
        return chatsStore.chats.sort((c1, c2) => c1.name.localeCompare(c2.name));
    }

    public render(): React.ReactNode {
        const dark = uiStore.isDark;

        return (
            <Popup zIndex={500} className={b()} closeHandler={SelectChat.closePopup} dark={dark}>
                <h2 className={`${b('title', { dark })} header3`}>Выберите чат</h2>
                <div className={b('list')}>
                    {this.chats.map(chat => (
                        <div
                            key={chat.id}
                            className={b('chat', { dark })}
                            data-chat={chat.id}
                            onClick={this.sendMessage}
                        >
                            <img className={b('chat-avatar')} src={chat.avatar} alt="" />
                            <div className={b('chat-name')}>{chat.displayName}</div>
                        </div>
                    ))}
                </div>
                <div className={b('actions')}>
                    <Button onClick={SelectChat.closePopup} type={dark ? 'dark' : 'main'}>
                        Отменить
                    </Button>
                </div>
            </Popup>
        );
    }

    private sendMessage = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        const chatId = event.currentTarget.dataset.chat;
        const chat = chatsStore.chatsMap.get(chatId);

        const forwarded = createForwardMessage(uiStore.forwardMessage, false);
        chat.sendMessage({ forwarded });

        this.props.history.push(`/chats/${chat.id}`);
        SelectChat.closePopup();
    };
}

export default withRouter(SelectChat);
