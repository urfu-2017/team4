import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Search from './Search';
import Preloader from '../Preloader';
import AddContact from '../AddContact';
import Button from '../Button';
import Contact from '../Contact';
import PopupHead from '../PopupHead';
import PopupBody from '../PopupBody';
import Popup from '../Popup';
import './Contacts.css';

import contactsStore from '../../domain/contacts-store';
import uiStore from '../../domain/ui-store';

const Head = ({ closeHandler }) => (
    <PopupHead className="contacts__head">
        <h2 className="contacts__heading header3">Контакты</h2>
        <div className="contacts__header-buttons">
            {
                contactsStore.state === 'loaded' &&
                <Button className="contacts__edit" type="heading">
                    Изменить
                </Button>
            }
            <Button className="contacts__close" onClick={closeHandler} type="heading">
                Закрыть
            </Button>
        </div>
    </PopupHead>
);

Head.propTypes = {
    closeHandler: PropTypes.func.isRequired
};

const List = observer(() => (
    contactsStore.state === 'empty' ? (
        <p className="text contacts__empty">
            Похоже, вы еще никого не добавили.
        </p>
    ) : (
        <ul className="contacts__list">
            {
                contactsStore.filteredList.map(contact => (
                    <Contact key={contact.username} {...contact}/>
                ))
            }
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
                <Popup
                    className="contacts"
                    closeHandler={uiStore.togglePopup('contacts')}
                    zIndex={100}
                >
                    <Head closeHandler={uiStore.togglePopup('contacts')}/>
                    {
                        contactsStore.state === 'loading' ? (
                            <Preloader size={50} className="contacts__preloader"/>
                        ) : (
                            <PopupBody className="contacts__main">
                                {contactsStore.state !== 'empty' && <Search/>}
                                <List/>
                                <Button className="contacts__new" onClick={this.toggleAddContact}>
                                    Добавить контакт
                                </Button>
                            </PopupBody>
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
