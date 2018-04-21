import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';

import AddContact from '../AddContact';
import Button from '../Button';
import Popup from '../Popup';
import Preloader from '../Preloader';
import Head from './Head';
import List from './List';
import Search from './Search';

import './Contacts.css';

import contactsStore from '../../domain/contacts-store';
import uiStore from '../../domain/ui-store';

const b = b_.with('contacts');

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
                    className={b()}
                    closeHandler={closeHandler}
                    zIndex={100}
                    headContent={<Head closeHandler={closeHandler} />}
                >
                    {contactsStore.state === 'loading' ? (
                        <Preloader size={50} className={b('preloader')} />
                    ) : (
                        <React.Fragment>
                            <main className={b('main')}>
                                {contactsStore.state !== 'empty' && <Search />}
                                <List />
                            </main>
                            <footer className={b('footer')}>
                                <Button className={b('new')} onClick={this.toggleAddContact}>
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
