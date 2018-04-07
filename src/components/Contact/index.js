import React from 'react';
import PropTypes from 'prop-types';
import './Contact.css';
import ava from '../../fixtures/avatar.png';

/* eslint-disable-next-line */
const Contact = ({ avatar, name, login }) => (
    <a key={login} href={`/chat/${login}`} className="contacts__contact contact">
        <img src={ava} alt="Аватар" className="contact__avatar"/>
        <div className="contact__info">
            <span className="contact__name">{name}</span>
            <span className="contact__login">{`@${login}`}</span>
        </div>
    </a>
);

Contact.propTypes = {
    name: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired
};

export default Contact;
