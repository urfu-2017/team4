import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';
import b_ from 'b_';

import OGData from '../OGData';
import Reaction from '../Reaction';
import EmojiPicker from '../EmojiPicker';

import uiStore from '../../domain/ui-store';
import usersStore from '../../domain/users-store';
import formatDate from '../../utils/format-date';
import markdown from '../../utils/markdown';
import { initContainer } from '../../utils/weather';

import getUrlMeta from '../../utils/url-meta';
import urlParser from '../../utils/url-parser';
import './Chat.css';
import Button from '../Button';

import './Chat.css';
const b = b_.with('message');

let idSmile = 2; // потом убрать
const list = [
    {
        id: 1,
        count: 2,
        smile: '😀'
    }
]; // потом убрать

interface Props {
    message: any;
    isChain?: boolean;
}

interface State {
    showSmiles: boolean;
}

@observer
class Message extends React.Component<Props, State> {
    private messageText: HTMLElement;
    private reaction: HTMLElement;

    @observable.ref
    private meta: any = null;

    constructor(props) {
        super(props);

        this.state = {
            showSmiles: false
        }
    }

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
        return usersStore.users.get(userId);
    }

    public showUserProfile = event => {
        event.preventDefault();
        uiStore.toggleUserInfoPopup(this.user);
    };

    public onShowSmiles = () => {
        this.setState(prev => ({
            showSmiles: !prev.showSmiles
        }));
    };

    public onCloseSmiles = () => {
        this.setState({
            showSmiles: false
        });
    }

    public addSmile = smile => {
        // this.props.message.reactionList === list
        const indexSmile = list.findIndex(reactionItem => reactionItem.smile === smile);
        if (indexSmile !== -1) {
            list[indexSmile].count++;
        } else {
            const reaction = { id: idSmile, count: 0, smile };
            idSmile++; // потом убрать
            reaction.count++;
            list.push(reaction);
        }
    }

    public render() {
        const { from, text, createdAt, attachment } = this.props.message;
        const displayName = this.user ? this.user.displayName : from;
        const avatar = this.user.avatar;

        const isMine = this.user.id === usersStore.currentUser.id;

        return (
            <div className={b({ mine: isMine, chain: this.props.isChain })}>
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
                    {attachment && <img src={attachment} className={b('attachment')}/>}
                    {this.meta && <OGData isInMessage={true} {...this.meta} />}
                    <div className="message__reactions">
                        <div className="message__reactions-list">
                            {
                                list.map(reaction =>
                                    <Reaction
                                        key={reaction.id}
                                        messageId={this.props.message.id}
                                        reaction={reaction}
                                    />
                                )
                            }
                        </div>
                    <Button onClick={this.onShowSmiles}>Reactions</Button>
                    </div>
                    {this.state.showSmiles && (
                        <EmojiPicker
                            className="message__smiles-picker"
                            addSmile={this.addSmile}
                            closeSmiles={this.onCloseSmiles}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default Message;
