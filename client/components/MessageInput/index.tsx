import { observer } from 'mobx-react';
import React from 'react';
import Textarea from 'react-textarea-autosize';
import b_ from 'b_';

import EmojiPicker from '../EmojiPicker';
import Button from '../Button';

import ChatsStore from '../../domain/chats-store';
import ogStore from '../../domain/og-store';

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

    public render() {
        return (
            <section className="message-input">
                <Textarea
                    minRows={3}
                    maxRows={6}
                    className={b('message')}
                    placeholder="Введите сообщение..."
                    onKeyPress={this.onKeyUp}
                    inputRef={input => (this.messageInput = input) /* tslint:disable-line */}
                />
                <Button className={b('send')} onClick={this.onSend}>
                    Отправить
                </Button>
                <div className="message-input__smiles">
                    <Button onClick={this.onShowSmiles}>Смайлы</Button>
                    {this.state.showSmiles && (
                        <EmojiPicker
                            className="message-input__smiles-picker"
                            addSmile={this.addSmile}
                            closeSmiles={this.onCloseSmiles}
                        />
                    )}
                </div>
            </section>
        );
    }
}

export default MessageInput;
