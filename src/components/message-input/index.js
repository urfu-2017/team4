const React = require('react');

class MessageInput extends React.Component {
    render() {
        return <section className="message-input">
            <textarea className="message-input__message" placeholder="Введите сообщение"></textarea>
            <button className="message-input__send">Отправить</button>
        </section>
    }
}

module.exports = MessageInput;