import React from 'react';
import { observer } from 'mobx-react';
import b_ from 'b_';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import UserModel from '../../domain/user-model';
import contactsStore from '../../domain/contacts-store';

import './FullUserInfo.css';
import chatsStore from '../../domain/chats-store';
import uiStore from '../../domain/ui-store';
const b = b_.with('user-full');

interface Props extends RouteComponentProps<{}> {
    user: UserModel;
}

interface State {
    isCreating: boolean;
}

@observer
class FullUserInfo extends React.Component<Props, State> {
    private static getInviteLink(username) {
        return `${location.origin + location.pathname}#/join/@${username}`;
    }

    public state: State = { isCreating: false };

    public render(): React.ReactNode {
        const { avatar, displayName, username } = this.props.user;
        const dark = uiStore.isDark;

        return (
            <section className={b('data')}>
                <div className={b('left')}>
                    <img src={avatar} alt="" className={b('avatar')} />
                    <div className={b('info')}>
                        <span className={b('name', { dark })}>{displayName}</span>
                        <span className={b('username')}>{`@${username}`}</span>
                    </div>
                </div>
                {this.renderActions()}
            </section>
        );
    }

    private renderActions = () => {
        const username = this.props.user.username;
        const isContact = !!contactsStore.list.find(user => user.username === username);

        return (
            <div className={b('actions')}>
                {!isContact ? (
                    <span
                        className={b('action', { dark: uiStore.isDark })}
                        onClick={this.addToContact}
                    >
                        Добавить в контакты
                    </span>
                ) : (
                    <CopyToClipboard
                        onCopy={this.onCopy}
                        text={FullUserInfo.getInviteLink(username)}
                    >
                        <span className={b('action', { dark: uiStore.isDark })}>
                            Скопировать ссылку на контакт
                        </span>
                    </CopyToClipboard>
                )}
                <span className={b('action', { dark: uiStore.isDark })} onClick={this.goToChat}>
                    Перейти в чат
                </span>
            </div>
        );
    };

    private onCopy = () => uiStore.setToast('Скопировано', 1000);

    private addToContact = () => {
        contactsStore.add(this.props.user);
    };

    private goToChat = async () => {
        if (this.state.isCreating) return;
        const { id } = this.props.user;
        let chat = chatsStore.findDialog(id);

        if (!chat) {
            this.setState({ isCreating: true });
            chat = await chatsStore.createChat('dialog', [id]);
            this.setState({ isCreating: false });
        }

        uiStore.closeAllPopups();
        this.props.history.push(`/chats/${chat.id}`);
    };
}

export default withRouter(FullUserInfo);
