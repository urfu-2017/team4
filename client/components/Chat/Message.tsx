/* eslint-disable no-return-assign */
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import OGData from '../OGData';

import UIStore from '../../domain/ui-store';
import UsersStore from '../../domain/users-store';
import formatDate from '../../utils/format-date';
import markdown from '../../utils/markdown';
import { initContainer } from '../../utils/weather';

import './Chat.css';

interface Props {
    message: any;
}

@observer
class Message extends React.Component<Props> {
    private messageText: HTMLElement;

    public componentDidMount() {
        initContainer(this.messageText);
    }

    @computed
    get user() {
        const username = this.props.message.from;
        return UsersStore.users.get(username);
    }

    public showUserProfile = event => {
        event.preventDefault();
        UIStore.toggleUserProfilePopup(this.user);
    };

    public render() {
        const { from, text, createdAt, ogData } = this.props.message;
        const displayName = this.user ? this.user.displayName : from;
        const avatar = this.user
            ? `data:image/png;base64,${this.user.avatar}`
            : 'https://server.adorable.io/avatars/128/abott@adorable.png';

        return (
            <div className="message">
                <img
                    onClick={this.showUserProfile}
                    className="message__avatar"
                    src={avatar}
                    alt="Аватар"
                />
                <div className="message__body">
                    <div className="message__username">
                        <span>{displayName}</span>
                        <span className="message__date">({formatDate(createdAt)})</span>
                    </div>
                    <div
                        ref={el => (this.messageText = el)}
                        className="message__text"
                        dangerouslySetInnerHTML={{ __html: markdown(text) }}
                    />
                </div>
                {ogData && <OGData isInMessage={true} {...ogData} />}
            </div>
        );
    }
}

export default Message;
