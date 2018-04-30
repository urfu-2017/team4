import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';

import OGData from '../OGData';

import UIStore from '../../domain/ui-store';
import UsersStore from '../../domain/users-store';
import formatDate from '../../utils/format-date';
import markdown from '../../utils/markdown';
import { initContainer } from '../../utils/weather';

import './Chat.css';

const b = b_.with('message');

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
            <div className={b()}>
                <img
                    onClick={this.showUserProfile}
                    className={b('avatar')}
                    src={avatar}
                    alt="Аватар"
                />
                <div className={b('body')}>
                    <div className={b('username')}>
                        <span>{displayName}</span>
                        <span className={b('date')}>({formatDate(createdAt)})</span>
                    </div>
                    <div
                        ref={el => (this.messageText = el)}
                        className={b('text')}
                        dangerouslySetInnerHTML={{ __html: markdown(text) }}
                    />
                </div>
                {ogData && <OGData isInMessage={true} {...ogData} />}
            </div>
        );
    }
}

export default Message;
