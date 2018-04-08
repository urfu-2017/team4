import React from 'react';
import PropTypes from 'prop-types';
import './Contact.css';
import ava from '../../fixtures/avatar.png';

/* eslint-disable-next-line */
const Contact = ({ avatar, firstName, lastName, username }) => (
    <a key={username} href={`/chat/${username}`} className="contacts__contact contact">
        <img src={avatar || ava} alt="Аватар" className="contact__avatar"/>
        <div className="contact__info">
            <span className="contact__name">{firstName} {lastName}</span>
            <span className="contact__login">{`@${username}`}</span>
        </div>
    </a>
);

Contact.propTypes = {
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string.isRequired
};

Contact.defaultProps = {
    firstName: '',
    lastName: ''
};

export default Contact;
