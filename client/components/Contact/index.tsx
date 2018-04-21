import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import b_ from 'b_';

import ChatsStore from '../../domain/chats-store';
import UIStore from '../../domain/ui-store';
import Preloader from '../Preloader';

import './Contact.css';

const b = b_.with('contact');

interface Props extends RouteComponentProps<{}> {
    username: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    className?: string;
}

@observer
class Contact extends React.Component<Props> {
    @observable public isCreating = false;

    public goToChat = async () => {
        if (this.isCreating) return;

        const { username } = this.props;
        let chat = ChatsStore.findDialog(username);

        if (!chat) {
            this.isCreating = true;
            chat = await ChatsStore.createChat('dialog', [username]);
            this.isCreating = false;
        }

        this.props.history.push(`/chats/${chat.id}`);
        UIStore.togglePopup('contacts')();
    };

    public render() {
        const { avatar, firstName, lastName, username } = this.props;

        return (
            <div
                onClick={this.goToChat}
                className={`${b()} ${this.props.className}`}
                title="Перейти в чат"
            >
                <img
                    src={avatar ? `data:image/png;base64,${avatar}` : ''}
                    alt="Аватар"
                    className={b('avatar')}
                />
                <div className={b('info')}>
                    <span className={b('name')}>
                        {firstName} {lastName}
                    </span>
                    <span className={b('login')}>{`@${username}`}</span>
                </div>
                {this.isCreating && <Preloader size={24} className={b('preloader')} />}
            </div>
        );
    }
}

export default withRouter(Contact);
