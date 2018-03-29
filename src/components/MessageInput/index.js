import React from 'react';
import Button from '../Button';
import './MessageInput.css';

class MessageInput extends React.Component {
    render() {
        return (
            <section className="message-input">
                <textarea
                    className="message-input__message"
                    placeholder="Введите сообщение..."
                    ref={(input) => { this.messageInput = input; }}
                />
                <Button className="message-input__send" type="main">Отправить</Button>
            </section>
        );
    }
}

export default MessageInput;
