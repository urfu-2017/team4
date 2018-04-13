import React from 'react';
import Textarea from 'react-textarea-autosize';

import Button from '../Button';
import ChatsStore from '../../domain/chats-store';

class MobileMessageInput extends React.Component {
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
            this.messageInput.focus();
        }
    };

    onKeyUp = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.onSend();
        }
    };

    render() {
        return (
            <section className="mobile-message-input">
                <Textarea
                    minRows={1}
                    maxRows={3}
                    className="mobile-message-input__message"
                    placeholder="Введите сообщение..."
                    onKeyPress={this.onKeyUp}
                    inputRef={(input) => {
                        this.messageInput = input;
                    }}
                />
                <Button className="mobile-message-input__send" onClick={this.onSend}/>
            </section>
        );
    }
}

export default MobileMessageInput;
