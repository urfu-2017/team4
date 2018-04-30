import React from 'react';
import b_ from 'b_';

import Contact from '../Contacts/Contact';
import Popup from '../Popup';
import Head from './Head';

import './CreateRoom.css';
const b = b_.with('createRoom');

import UiStore from '../../domain/ui-store';
import ContactsStore from '../../domain/contacts-store';
import Button from '../Button';

export default class CreateRoom extends React.Component {

    private static closePopup() {
        UiStore.togglePopup('createRoom')();
    }

    public render(): React.ReactNode {
        const contacts = ContactsStore.list;

        return (
            <React.Fragment>
                <Popup
                    className={b()}
                    zIndex={100}
                    headContent={<Head closeHandler={CreateRoom.closePopup}/>}
                    closeHandler={CreateRoom.closePopup}
                >
                    <div className={b('inner')}>
                        <label className={b('field')}>
                            <span className={b('field-label')}>Название группы:</span>
                            <input
                                className={b('field-input')}
                                type={'text'}
                                placeholder={'Введите название группы'}
                            />
                        </label>
                        <div className={b('field')}>
                            <span className={b('field-label')}>Участники:</span>
                            {contacts.length === 0 ? (
                                <span>У вас нет контактов</span>
                            ) : this.renderContactsList()}
                        </div>
                        <Button>Создать группу</Button>
                    </div>

                </Popup>
            </React.Fragment>
        );
    }

    private renderContactsList() {
        const contacts = ContactsStore.list;

        return contacts.map(contact => (
            <div id={contact.id} className={b('member')}>
                <Contact {...contact}/>
            </div>
        ));
    }
}
