import { observer } from 'mobx-react';
import React from 'react';
import Textarea from 'react-textarea-autosize';
import b_ from 'b_';

import Button from '../Button';
import OGData from '../OGData';
import Preloader from '../Preloader';

import './MessageInput.css';

import ChatsStore from '../../domain/chats-store';
import ogStore from '../../domain/og-store';
import urlParser from '../../utils/url-parser';

const b = b_.with('message-input');

@observer
class MessageInput extends React.Component {
    private messageInput: HTMLTextAreaElement;

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
            <section className={b()}>
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
