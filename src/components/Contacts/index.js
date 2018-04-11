import React from 'react';
import { observer } from 'mobx-react';

import Search from './Search';
import Preloader from '../Preloader';
import AddContact from '../AddContact';
import Button from '../Button';
import Popup from '../Popup';
import Head from './Head';
import List from './List';
import './Contacts.css';

import contactsStore from '../../domain/contacts-store';
import uiStore from '../../domain/ui-store';

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
        const closeHandler = uiStore.togglePopup('contacts');

        return (
            <React.Fragment>
                <Popup
                    className="contacts"
                    closeHandler={closeHandler}
                    zIndex={100}
                    headContent={<Head closeHandler={closeHandler}/>}
                >
                    {
                        contactsStore.state === 'loading' ? (
                            <Preloader size={50} className="contacts__preloader"/>
                        ) : (
                            <React.Fragment>
                                <main className="contacts__main">
                                    {contactsStore.state !== 'empty' && <Search/>}
                                    <List/>
                                </main>
                                <footer className="contacts__footer">
                                    <Button className="contacts__new" onClick={this.toggleAddContact}>
                                        Добавить контакт
                                    </Button>
                                </footer>
                            </React.Fragment>
                        )
                    }
                </Popup>
                {
                    this.state.displayAddContact &&
                    <AddContact closeHandler={this.toggleAddContact}/>
                }
            </React.Fragment>
        );
    }
}

export default Contacts;
