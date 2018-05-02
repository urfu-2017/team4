import { observer } from 'mobx-react';
import React from 'react';
import Textarea from 'react-textarea-autosize';
import b_ from 'b_';

import EmojiPicker from '../EmojiPicker';
import Button from '../Button';
import OGData from '../OGData';
import Preloader from '../Preloader';

import ChatsStore from '../../domain/chats-store';
import ogStore from '../../domain/og-store';
import urlParser from '../../utils/url-parser';

import './MessageInput.css';
const b = b_.with('message-input');

interface State {
    showSmiles: boolean;
}

@observer
class MessageInput extends React.Component<{}, State> {

    private messageInput: HTMLTextAreaElement;

    constructor(props) {
        super(props);

        this.state = {
            showSmiles: false
        }
    }

    public onSend = async () => {
        const text = this.messageInput.value.trim();
        const ogData = ogStore.data;

        if (!text) {
            return;
        }

        try {
            this.messageInput.disabled = true;
            await ChatsStore.currentChat.sendMessage(text, ogData);
            ogStore.clear();
            this.messageInput.value = null;
        } finally {
            this.messageInput.disabled = false;
            this.messageInput.focus();
        }
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
        this.messageInput.value += smile;
    }

    public onKeyUp = event => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.onSend();
        }
    };

    public onInput = event => {
        const url = urlParser(event.target.value);

        if (url) {
            ogStore.setUrl(url);
        }
    };

    public renderOG() {
        return ogStore.state === 'loaded' && <OGData {...ogStore.data} />;
    }

    public render() {
        return (
            <section className="message-input">
                {
                    this.state.showSmiles
                        ? <EmojiPicker
                            addSmile={this.addSmile}
                            closeSmiles={this.onCloseSmiles}
                        />
                        : null
                }
                <Textarea
                    minRows={3}
                    maxRows={6}
                    className={b('message')}
                    placeholder="Введите сообщение..."
                    onKeyPress={this.onKeyUp}
                    onInput={this.onInput}
                    inputRef={input => (this.messageInput = input) /* tslint:disable-line */}
                />
                <Button className={b('send')} onClick={this.onSend}>
                    Отправить
                </Button>
                <Button className="message-input__smiles" onClick={this.onShowSmiles}>
                    Смайлы
                </Button>
                {ogStore.state === 'loading' ? (
                    <Preloader className={b('preloader')} size={40} />
                ) : (
                    this.renderOG()
                )}
            </section>
        );
    }
}

export default MessageInput;
