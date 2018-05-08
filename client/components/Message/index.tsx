import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';

import OGData from '../OGData';
import Reactions from '../Reactions';
import ForwardMessageIcon from './ForwardMessageIcon';

import { APP_URL } from '../../config';
import uiStore from '../../domain/ui-store';
import usersStore from '../../domain/users-store';
import chatsStore from '../../domain/chats-store';
import formatDate from '../../utils/format-date';
import markdown from '../../utils/markdown';
import { initContainer } from '../../utils/weather';

import getUrlMeta from '../../utils/url-meta';
import urlParser from '../../utils/url-parser';

import './Message.css';
const b = b_.with('message');

interface Props {
    message: any;
    isChain?: boolean;
}

@observer
class Message extends React.Component<Props> {
    private messageText: HTMLElement;

    @observable.ref private meta: any = null;

    public componentDidMount() {
        const { text, id } = this.props.message;
        const url = urlParser(text);

        if (url && !url.startsWith(APP_URL)) {
            getUrlMeta(url, id).then(this.setMeta);
        }

        initContainer(this.messageText);
    }

    @computed
    get user() {
        const userId = this.props.message.senderId;
        return usersStore.users.get(userId);
    }

    public showUserProfile = event => {
        event.preventDefault();
        uiStore.toggleUserInfoPopup(this.user);
    };

    public render() {
        const { from, text, createdAt, attachment, reactions } = this.props.message;
        const displayName = this.user ? this.user.displayName : from;
        const avatar = this.user.avatar;

        const isSelected = uiStore.forwardMessage === this.props.message;
        const isMine = this.user.id === usersStore.currentUser.id;
        const mods = { mine: isMine, chain: this.props.isChain, selected: isSelected };

        return (
            <div className={b(mods)}>
                <div className={b('meta')}>
                    <img
                        onClick={this.showUserProfile}
                        className={b('avatar')}
                        src={avatar}
                        alt={displayName}
                        title={displayName}
                    />
                    <span className={b('date')}>{formatDate(createdAt)}</span>
                </div>
                <div className={b('body')}>
                    <div
                        ref={el => (this.messageText = el)}
                        className={b('text')}
                        dangerouslySetInnerHTML={{ __html: markdown(text) }}
                    />
                    {attachment && <img src={attachment} className={b('attachment')} />}
                    {this.meta && <OGData isInMessage={true} {...this.meta} />}
                    <Reactions reactions={reactions} onClick={this.onClickReaction} />
                </div>
                <div className={b('actions')}>
                    <span
                        onClick={this.onSetForwardMessage}
                        className={b('action', { type: 'forward' })}
                        title="Переслать"
                    >
                        <ForwardMessageIcon className={b('icon')}/>
                    </span>
                </div>
            </div>
        );
    }

    private onClickReaction = async smile => {
        try {
            const { reactions, id } = this.props.message;
            const userId = usersStore.currentUser.id;

            const reaction = reactions.find(rcn => rcn.reaction === smile && rcn.userId === userId);

            if (reaction) {
                await chatsStore.currentChat.removeReaction(reaction.id, reaction.messageId);
            } else {
                await chatsStore.currentChat.addReaction(smile, id);
            }
        } catch (e) {
            // TODO: Use logger
        }
    };

    @action
    private setMeta = (meta: any) => {
        this.meta = meta;
    };

    private onSetForwardMessage = () => {
        if (uiStore.forwardMessage === this.props.message) {
            uiStore.setForwardMessage(null);
            return;
        }

        uiStore.setForwardMessage(this.props.message);
    }
}

export default Message;
