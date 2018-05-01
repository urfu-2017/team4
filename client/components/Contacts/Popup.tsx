import { observer } from 'mobx-react';
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import b_ from 'b_';

import AddContact from './AddForm';
import Button from '../Button';
import Popup from '../Popup';
import Preloader from '../Preloader';
import Head from './Head';
import List from './List';
import Search from './Search';

import chatsStore from '../../domain/chats-store';
import contactsStore from '../../domain/contacts-store';
import uiStore from '../../domain/ui-store';

import './Contacts.css';
const b = b_.with('contacts');

interface State {
    displayAddContact: boolean;
    isCreating: boolean;
}

@observer
class Contacts extends React.Component<RouteComponentProps<{}>, State> {
    constructor(props) {
        super(props);

        this.state = {
            isCreating: false,
            displayAddContact: false
        };
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
                                <List onClick={this.goToChat}/>
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

    private goToChat = async (id: string) => {
        if (this.state.isCreating) return;
        let chat = chatsStore.findDialog(id);

        if (!chat) {
            this.setState({ isCreating: true });
            chat = await chatsStore.createChat('dialog', [id]);
            this.setState({ isCreating: false });
        }

        this.props.history.push(`/chats/${chat.id}`);
        uiStore.togglePopup('contacts')();
    };
}

export default withRouter(Contacts);
