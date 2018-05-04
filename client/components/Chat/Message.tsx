import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';

import OGData from '../OGData';

import UIStore from '../../domain/ui-store';
import UsersStore from '../../domain/users-store';
import formatDate from '../../utils/format-date';
import markdown from '../../utils/markdown';
import { initContainer } from '../../utils/weather';

import getUrlMeta from '../../utils/url-meta';
import urlParser from '../../utils/url-parser';

import './Chat.css';
const b = b_.with('message');

interface Props {
    message: any;
}

@observer
class Message extends React.Component<Props> {

    private messageText: HTMLElement;

    @observable.ref
    private meta: any = null;

    public componentDidMount() {
        const { text, id } = this.props.message;
        const url = urlParser(text);

        if (url) {
            getUrlMeta(url, id).then(meta => {
               this.meta = meta;
            });
        }

        initContainer(this.messageText);
    }

    @computed
    get user() {
        const userId = this.props.message.senderId;
        return UsersStore.users.get(userId);
    }

    public showUserProfile = event => {
        event.preventDefault();
        UIStore.toggleUserInfoPopup(this.user);
    };

    public render() {
        const { from, text, createdAt, attachment } = this.props.message;
        const displayName = this.user ? this.user.displayName : from;
        const avatar = this.user.avatar;

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
                {attachment && <img src={attachment} className={b('attachment')}/>}
                {this.meta && <OGData isInMessage={true} {...this.meta} />}
            </div>
        );
    }
}

export default Message;
