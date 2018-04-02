import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Search from './Search';
import Preloader from '../Preloader';
import AddContact from '../AddContact';
import Overlay from '../Overlay';
import Button from '../Button';
import Contact from '../Contact';
import './Contacts.css';

import contactsStore from '../../domain/contacts-store';

const Head = ({ closeHandler }) => (
    <header className="contacts__head">
        <h2 className="contacts__heading header3">Контакты</h2>
        <div className="contacts__header-buttons">
            {
                !contactsStore.isEmpty ? (
                    <Button className="contacts__edit" type="heading">
                        Изменить
                    </Button>
                ) : (
                    null
                )
            }
            <Button className="contacts__close" onClick={closeHandler} type="heading">
                Закрыть
            </Button>
        </div>
    </header>
);

Head.propTypes = {
    closeHandler: PropTypes.func.isRequired
};

const List = observer(() => (
    contactsStore.isEmpty ? (
        <p className="text contacts__empty">
            Похоже, вы еще никого не добавили.
        </p>
    ) : (
        <ul className="contacts__list">
            {contactsStore.filteredList.map(Contact)}
        </ul>
    )
));

@observer
class Contacts extends React.Component {
    constructor() {
        super();
        this.state = {
            displayAddContact: false
        };
    }

    componentDidMount() {
        if (!contactsStore.isLoaded) {
            contactsStore.loadList();
        }
    }

    toggleAddContact = () => {
        this.setState(prev => ({
            displayAddContact: !prev.displayAddContact
        }));
    };

    render() {
        return (
            <React.Fragment>
                <section className="contacts">
                    <Head closeHandler={this.props.closeContacts}/>
                    {
                        !contactsStore.isLoaded ? (
                            <Preloader size={50} className="contacts__preloader"/>
                        ) : (
                            <React.Fragment>
                                <Search/>
                                <List/>
                                <Button className="contacts__new" onClick={this.toggleAddContact}>
                                    Добавить контакт
                                </Button>
                            </React.Fragment>
                        )
                    }
                </section>
                {
                    this.state.displayAddContact ? (
                        <AddContact closeHandler={this.toggleAddContact}/>
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
