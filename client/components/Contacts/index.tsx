import { observer } from 'mobx-react';
import React from 'react';

import AddContact from '../AddContact';
import Button from '../Button';
import Popup from '../Popup';
import Preloader from '../Preloader';
import './Contacts.css';
import Head from './Head';
import List from './List';
import Search from './Search';

import contactsStore from '../../domain/contacts-store';
import uiStore from '../../domain/ui-store';

interface State {
    displayAddContact: boolean;
}

@observer
class Contacts extends React.Component<{}, State> {
    constructor(props) {
        super(props);

        this.state = {
            displayAddContact: false
        };
    }

    public componentDidMount() {
        if (contactsStore.state !== 'loaded') {
            contactsStore.loadList();
        }
    }

    public toggleAddContact = () => {
        this.setState(prev => ({
            displayAddContact: !prev.displayAddContact
        }));
    };

    public render() {
        const closeHandler = uiStore.togglePopup('contacts');

        return (
            <React.Fragment>
                <Popup
                    className="contacts"
                    closeHandler={closeHandler}
                    zIndex={100}
                    headContent={<Head closeHandler={closeHandler} />}
                >
                    {contactsStore.state === 'loading' ? (
                        <Preloader size={50} className="contacts__preloader" />
                    ) : (
                        <React.Fragment>
                            <main className="contacts__main">
                                {contactsStore.state !== 'empty' && <Search />}
                                <List />
                            </main>
                            <footer className="contacts__footer">
                                <Button className="contacts__new" onClick={this.toggleAddContact}>
                                    Добавить контакт
                                </Button>
                            </footer>
                        </React.Fragment>
                    )}
                </Popup>
                {this.state.displayAddContact && (
                    <AddContact closeHandler={this.toggleAddContact} />
                )}
            </React.Fragment>
        );
    }
}

export default Contacts;
