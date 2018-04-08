import React from 'react';
import Button from '../Button';
import './MessageInput.css';

import ChatsStore from '../../domain/chats-store';

class MessageInput extends React.Component {
    onSend = () => {
        const text = this.messageInput.value;

        if (text) {
            // eslint-disable-next-line
            ChatsStore.currentChat.sendMessage(text);
            this.messageInput.value = null;
        }
    }

    render() {
        return (
            <section className="message-input">
                <textarea
                    className="message-input__message"
                    placeholder="Введите сообщение..."
                    ref={(input) => {
                        this.messageInput = input;
                    }}
                />
                <Button className="message-input__send" onClick={this.onSend}>Отправить</Button>
            </section>
        );
    }
}

export default MessageInput;
