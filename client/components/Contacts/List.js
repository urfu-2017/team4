import React from 'react';
import { observer } from 'mobx-react';

import Contact from '../Contact';
import contactsStore from '../../domain/contacts-store';

const List = observer(
    () =>
        contactsStore.state === 'empty' ? (
            <p className="text contacts__empty">Похоже, вы еще никого не добавили.</p>
        ) : (
            <ul className="contacts__list">
                {contactsStore.filteredList.map(contact => (
                    <Contact
                        key={contact.username}
                        avatar={contact.avatar}
                        username={contact.username}
                        firstName={contact.firstName}
                        lastName={contact.lastName}
                    />
                ))}
            </ul>
        )
);

export default List;
