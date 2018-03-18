import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const Head = () => (
    <header className="contacts__head">
        <h2 className="contacts__title">Контакты</h2>
        <div className="contacts__header-buttons">
            <button className="contacts__edit button_light">Редактировать</button>
            <button className="contacts__close button_light">Закрыть</button>
        </div>
    </header>
);

const Contact = ({ avatar, name, id, login }) => (
    <a href={`/chat/${id}`} className="contacts__contact contact">
        <img src={avatar} alt="Аватар" className="contact__avatar" />
        <div className="contact__info">
            <span className="contact__name">{name}</span>
            <span className="contact__login">{`@${login}`}</span>
        </div>
    </a>
);

Contact.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired
};

const AddContact = () => (
    <section className="contacts__add-contact add-contact">
        <h2 className="add-contact__heading">Добавить контакт</h2>
        <input type="text" className="add-contact__phone" id="add-phone" />
        <label htmlFor="add-phone" className="add-contact__label">Номер телефона</label>
        <input type="text" className="add-contact__first-name" id="add-first" />
        <label htmlFor="add-first" className="add-contact__label">Номер телефона</label>
        <input type="text" className="add-contact__last-name" id="add-last" />
        <label htmlFor="add-last" className="add-contact__label">Номер телефона</label>
        <div className="add-contact__buttons">
            <button className="add-contact__cancel">Отмена</button>
            <button className="add-contact__add">Добавить</button>
        </div>
    </section>
);

const Contacts = ({ contactsList }) => (
    <section className="contacts">
        <Head />
        <input className="contacts__search" type="search" />
        <section className="contacts__list">
            {contactsList.map(Contact)}
        </section>
        <button className="contacts__new">Новый контакт</button>
    </section>
);

Contacts.propTypes = {
    contactsList: PropTypes.arrayOf(PropTypes.shape(Contact.propTypes))
};

export default Contacts;
