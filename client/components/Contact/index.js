import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { withRouter } from 'react-router-dom';
import './Contact.css';

import Preloader from '../Preloader';
import ChatsStore from '../../domain/chats-store';
import UIStore from '../../domain/ui-store';

import ava from '../../fixtures/avatar.png';

@withRouter
@observer
class Contact extends React.Component {
    goToChat = async () => {
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

    @observable isCreating = false;

    render() {
        const { avatar, firstName, lastName, username } = this.props;

        return (
            <div
                onClick={this.goToChat}
                className="contacts__contact contact"
                title="Перейти в чат"
            >
                <img
                    src={avatar ? `data:image/png;base64,${avatar}` : ava}
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

Contact.propTypes = {
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string
};

Contact.defaultProps = {
    firstName: '',
    lastName: '',
    avatar: ''
};

export default Contact;
