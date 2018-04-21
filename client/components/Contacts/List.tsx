import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';

import contactsStore from '../../domain/contacts-store';
import Contact from '../Contact';

const b = b_.with('contacts');

const List: React.SFC = observer(
    () =>
        contactsStore.state === 'empty' ? (
            <p className={`${b('empty')} text`}>Похоже, вы еще никого не добавили.</p>
        ) : (
            <ul className={b('list')}>
                {contactsStore.filteredList.map(contact => (
                    <Contact
                        key={contact.username}
                        avatar={contact.avatar}
                        username={contact.username}
                        firstName={contact.firstName}
                        lastName={contact.lastName}
                        className={b('contact')}
                    />
                ))}
            </ul>
        )
);

export default List;
