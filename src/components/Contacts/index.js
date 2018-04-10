import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import './Contacts.css';
import Search from './Search';
import Preloader from '../Preloader';
import AddContact from '../AddContact';
import Overlay from '../Overlay';
import Button from '../Button';
import Head from './Head';
import List from './List';

import contactsStore from '../../domain/contacts-store';

@observer
class Contacts extends React.Component {
    constructor() {
        super();
        this.state = {
            displayAddContact: false
        };
    }

    componentDidMount() {
        if (contactsStore.state !== 'loaded') {
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
                        contactsStore.state === 'loading' ? (
                            <Preloader size={50} className="contacts__preloader"/>
                        ) : (
                            <React.Fragment>
                                {contactsStore.state !== 'empty' && <Search/>}
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
