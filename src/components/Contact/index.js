import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import './Contact.css';

import ChatsStore from '../../domain/chats-store';
import UsersStore from '../../domain/users-store';
import UIStore from '../../domain/ui-store';

import ava from '../../fixtures/avatar.png';

@withRouter
@observer
class Contact extends React.Component {
    onClick = async () => {
        let { chat } = this;

        if (!this.chat) {
            chat = await ChatsStore.createChat('dialog', [this.props.username]);
        }

        // eslint-disable-next-line react/prop-types
        this.props.history.push(`/chats/${chat.id}`);
        UIStore.togglePopup('contacts')();
    };

    get chat() {
        const currentUsername = UsersStore.currentUser.username;
        const contactUsername = this.props.username;

        const id = [currentUsername, contactUsername].sort((a, b) => a.localeCompare(b)).join('_');
        const chat = ChatsStore.chatsMap.get(id);

        return chat || null;
    }

    render() {
        const { avatar, firstName, lastName, username } = this.props;

        return (
            <div onClick={this.onClick} className="contacts__contact contact">
                <img src={avatar ? `data:image/png;base64,${avatar}` : ava} alt="Аватар" className="contact__avatar"/>
                <div className="contact__info">
                    <span className="contact__name">{firstName} {lastName}</span>
                    <span className="contact__login">{`@${username}`}</span>
                </div>
            </div>
        );
    }
}

Contact.propTypes = {
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string.isRequired
};

Contact.defaultProps = {
    firstName: '',
    lastName: ''
};

export default Contact;
