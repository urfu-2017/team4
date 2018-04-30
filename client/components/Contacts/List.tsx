import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';

import contactsStore from '../../domain/contacts-store';

import Contact from './Contact';
const b = b_.with('contacts');

interface Props {
    selected?: string[];
    onClick?: (id: string) => void;
}

@observer
class ContactsList extends React.Component<Props> {

    public render(): React.ReactNode {
        if (contactsStore.state === 'empty') {
            return (
                <p className={`${b('empty')} text`}>Похоже, у вас ещё нет контактов.</p>
            );
        }

        const { selected = [], onClick } = this.props;

        return (
            <ul className={b('list')}>
                {contactsStore.filteredList.map(contact => (
                    <Contact
                        key={contact.id}
                        id={contact.id}
                        avatar={contact.avatar}
                        username={contact.username}
                        firstName={contact.firstName}
                        lastName={contact.lastName}
                        className={b('contact')}
                        onClick={onClick}
                        selected={selected.includes(contact.id)}
                        selectable={true}
                    />
                ))}
            </ul>
        );
    }
}

export default ContactsList;
