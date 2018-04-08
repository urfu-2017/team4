import React from 'react';
import Textarea from 'react-textarea-autosize';

import Button from '../Button';
import './MessageInput.css';

import ChatsStore from '../../domain/chats-store';

class MessageInput extends React.Component {
    onSend = async () => {
        const text = this.messageInput.value.trim();

        if (!text) {
            return;
        }

        try {
            // eslint-disable-next-line
            this.messageInput.disabled = true;
            await ChatsStore.currentChat.sendMessage(text);
            this.messageInput.value = null;
        } finally {
            this.messageInput.disabled = false;
        }
    };

    onKeyUp = (event) => {
        if (event.key === 'Enter' && event.shiftKey) {
            event.preventDefault();
            this.onSend();
        }
    };

    render() {
        return (
            <section className="message-input">
                <Textarea
                    minRows={3}
                    maxRows={6}
                    className="message-input__message"
                    placeholder="Введите сообщение..."
                    onKeyUp={this.onKeyUp}
                    inputRef={(input) => {
                        this.messageInput = input;
                    }}
                />
                <Button className="message-input__send" onClick={this.onSend}>Отправить</Button>
            </section>
        );
    }
}

export default MessageInput;
