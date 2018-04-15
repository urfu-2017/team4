import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './Contact.css';

import ChatsStore from '../../domain/chats-store';
import UIStore from '../../domain/ui-store';
import Preloader from '../Preloader';

interface Props extends RouteComponentProps<{}> {
    username: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
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

        // eslint-disable-next-line react/prop-types
        this.props.history.push(`/chats/${chat.id}`);
        UIStore.togglePopup('contacts')();
    };

    public render() {
        const { avatar, firstName, lastName, username } = this.props;

        return (
            <div
                onClick={this.goToChat}
                className="contacts__contact contact"
                title="Перейти в чат"
            >
                <img
                    src={avatar ? `data:image/png;base64,${avatar}` : ''}
                    alt="Аватар"
                    className="contact__avatar"
                />
                <div className="contact__info">
                    <span className="contact__name">
                        {firstName} {lastName}
                    </span>
                    <span className="contact__login">{`@${username}`}</span>
                </div>
                {this.isCreating && <Preloader size={24} className="contact__preloader" />}
            </div>
        );
    }
}

export default withRouter(Contact);
