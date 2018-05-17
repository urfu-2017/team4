import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';

import OGData from '../OGData';
import Reactions from '../Reactions';
import ReplyIcon from './ReplyIcon';

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
import ImageViewer from '../ImageViewer';
const b = b_.with('message');

interface Props {
    message: any;
    isChain?: boolean;
}

@observer
class Message extends React.Component<Props> {
    private messageText: HTMLElement;

    @observable.ref private meta: any = null;
    @observable private displayImage: boolean = false;

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
        const dark = uiStore.isDark;

        const isMine = this.user.id === usersStore.currentUser.id;
        const isReal = !!createdAt;

        const mods = { mine: isMine, chain: this.props.isChain, sending: !isReal };

        return (
            <div className={b(mods)}>
                <div className={b('meta')}>
                    <img
                        onClick={this.showUserProfile}
                        className={b('avatar')}
                        src={avatar}
                        alt=""
                        title={displayName}
                    />
                    <span className={b('date', { dark })}>
                        {isReal ? formatDate(createdAt) : '...'}
                    </span>
                </div>
                <div className={b('body', { dark })}>
                    <div
                        ref={el => (this.messageText = el)}
                        className={b('text')}
                        dangerouslySetInnerHTML={{ __html: markdown(text) }}
                    />
                    {attachment && (
                        <img
                            src={attachment}
                            className={b('attachment')}
                            onClick={this.toggleImage}
                        />
                    )}
                    {this.displayImage && (
                        <ImageViewer src={attachment} closeHandler={this.toggleImage} />
                    )}
                    {isReal && this.meta && <OGData isInMessage={true} {...this.meta} />}
                    {isReal && <Reactions reactions={reactions} onClick={this.onClickReaction} />}
                </div>
                {isReal && this.renderActions()}
            </div>
        );
    }

    private renderActions() {
        return (
            <div className={b('actions')}>
                <span
                    onClick={this.onSetReplyMessage}
                    className={b('action', { type: 'reply' })}
                    title="Ответить"
                >
                    <ReplyIcon className={b('icon')} />
                </span>
                <span
                    onClick={this.onSetForwardMessage}
                    className={b('action', { type: 'forward' })}
                    title="Переслать"
                >
                    <ReplyIcon className={b('icon')} />
                </span>
            </div>
        );
    }

    private onClickReaction = async smile => {
        const { reactions, id } = this.props.message;
        const userId = usersStore.currentUser.id;

        const reaction = reactions.find(rcn => rcn.reaction === smile && rcn.userId === userId);

        try {
            if (reaction) {
                await chatsStore.currentChat.removeReaction(reaction.id, reaction.messageId);
            } else {
                await chatsStore.currentChat.addReaction(smile, id);
            }
        } catch (e) {
            uiStore.setToast('Не удалось среагировать на сообщение');
        }
    };

    @action
    private setMeta = (meta: any) => {
        this.meta = meta;
    };

    @action
    private toggleImage = () => {
        this.displayImage = !this.displayImage;
    };

    private onSetReplyMessage = () => {
        if (uiStore.forwardMessage === this.props.message) {
            uiStore.setForwardMessage(null);
            return;
        }

        uiStore.setForwardMessage(this.props.message, true);
    };

    private onSetForwardMessage = () => {
        uiStore.setForwardMessage(this.props.message, false);
        uiStore.togglePopup('selectChat')();
    };
}

export default Message;
