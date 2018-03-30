import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import ContactsList from './ContactsList';
import AddContact from '../AddContact';
import Overlay from '../Overlay';
import Button from '../Button';
import './Contacts.css';

const Head = ({ closeHandler, isContactsListLoaded }) => (
    <header className="contacts__head">
        <h2 className="contacts__title header3">Контакты</h2>
        <div className="contacts__header-buttons">
            {isContactsListLoaded ? (
                <Button className="contacts__edit" type="heading">
                    Редактировать
                </Button>
            ) : (
                null
            )}
            <Button className="contacts__close" onClick={closeHandler} type="heading">
                Закрыть
            </Button>
        </div>
    </header>
);

Head.propTypes = {
    closeHandler: PropTypes.func.isRequired,
    isContactsListLoaded: PropTypes.bool.isRequired
};

const Contact = ({ avatar, name, id, login }) => (
    <a key={id} href={`/chat/${id}`} className="contacts__contact contact">
        <img src={avatar} alt="Аватар" className="contact__avatar"/>
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

const Preloader = () => (
    <p className="contacts__preloader text">Загружаем контакты</p>
);

@observer
class Contacts extends React.Component {
    constructor() {
        super();
        this.state = {
            displayAddContact: false
        };
        this.showAddContact = this.showAddContact.bind(this);
        this.hideAddContact = this.hideAddContact.bind(this);
    }

    componentDidMount() {
        this.contactsList.loadList();
    }

    contactsList = new ContactsList();

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
                    <Head
                        closeHandler={this.props.closeContacts}
                        isContactsListLoaded={this.contactsList.isLoaded}
                    />
                    {
                        this.contactsList.isLoaded ? (
                            <React.Fragment>
                                <div className="contacts__search-wrapper">
                                    <input className="contacts__search" type="search" placeholder="Поиск..."/>
                                </div>
                                {
                                    this.contactsList.isEmpty ? (
                                        <p className="text contacts__empty">
                                            Похоже вы еще никого не добавили
                                        </p>
                                    ) : (
                                        <ul className="contacts__list">
                                            {this.contactsList.list.map(Contact)}
                                        </ul>
                                    )
                                }
                            </React.Fragment>
                        ) : (
                            <Preloader/>
                        )
                    }
                    <Button className="contacts__new" onClick={this.showAddContact}>
                        Добавить контакт
                    </Button>
                </section>
                {
                    this.state.displayAddContact ? (
                        <AddContact closeHandler={this.hideAddContact}/>
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
    closeContacts: PropTypes.func.isRequired
};

export default Contacts;
