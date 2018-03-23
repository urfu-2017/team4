import React from 'react';
import PropTypes from 'prop-types';

import AddContact from '../add-contact';
import Overlay from '../overlay';
import HeadingBtn from '../heading-btn';
import MainBtn from '../main-btn';
import './index.css';

const Head = props => (
    <header className="contacts__head">
        <h2 className="contacts__title">Контакты</h2>
        <div className="contacts__header-buttons">
            <HeadingBtn className="contacts__edit">
                Редактировать
            </HeadingBtn>
            <HeadingBtn className="contacts__close" onClick={props.closeHandler}>
                Закрыть
            </HeadingBtn>
        </div>
    </header>
);

Head.propTypes = {
    closeHandler: PropTypes.func.isRequired
};

const Contact = ({ avatar, name, id, login }) => (
    <a key={id} href={`/chat/${id}`} className="contacts__contact contact">
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

class Contacts extends React.Component {
    constructor() {
        super();
        this.state = {
            displayAddContact: false
        };
        this.showAddContact = this.showAddContact.bind(this);
        this.hideAddContact = this.hideAddContact.bind(this);
    }

    showAddContact() {
        this.setState({
            displayAddContact: true
        });
    }

    hideAddContact() {
        this.setState({
            displayAddContact: false
        });
    }

    render() {
        return (
            <React.Fragment>
                <section className="contacts">
                    <Head closeHandler={this.props.closeContacts} />
                    <div className="contacts__search-wrapper">
                        <input className="contacts__search" type="search" placeholder="Поиск..." />
                    </div>
                    <ul className="contacts__list">
                        {this.props.contactsList.map(Contact)}
                    </ul>
                    <MainBtn className="contacts__new" onClick={this.showAddContact}>
                        Добавить контакт
                    </MainBtn>
                </section>
                {
                    this.state.displayAddContact ? (
                        <AddContact closeHandler={this.hideAddContact} />
                    ) : (
                        <Overlay
                            closeHandler={this.props.closeContacts}
                            className="contacts__overlay"
                            />
                    )
                }
            </React.Fragment>
        );
    }
}

Contacts.propTypes = {
    contactsList: PropTypes.arrayOf(PropTypes.shape(Contact.propTypes)).isRequired,
    closeContacts: PropTypes.func.isRequired
};

export default Contacts;
