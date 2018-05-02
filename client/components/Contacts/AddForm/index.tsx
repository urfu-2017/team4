import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';

import UsersList from '../../UsersList';
import Button from '../../Button';
import Popup from '../../Popup';
import Preloader from '../../Preloader';
import Search from './Search';

import contactsStore from '../../../domain/contacts-store';
import userSearchStore from '../../../domain/user-search-store';

import './AddContact.css';

interface Props {
    closeHandler: () => void;
}

const b = b_.with('add-contact');

@observer
class AddContact extends React.Component<Props> {
    public componentWillUnmount() {
        userSearchStore.clear();
    }

    public render() {
        const users = userSearchStore.users;
        const selected = userSearchStore.users
            .filter(user => contactsStore.has(user.username))
            .map(contact => contact.id);

        return (
            <Popup className={b()} closeHandler={this.props.closeHandler} zIndex={200}>
                <h2 className={`${b('heading')} header3`}>Добавить контакт</h2>
                <div className={b('search-zone')}>
                    {userSearchStore.state === 'loaded' ? (
                        <UsersList
                            onClick={this.addUser}
                            users={users}
                            selected={selected}
                            disableSearch={true}
                        />
                    ) : (
                        <Search className={b('input')} />
                    )}
                </div>
                <div className={b('buttons')}>
                    {userSearchStore.state === 'loaded' ? (
                        <React.Fragment>
                            <Button className={b('clear-btn')} onClick={userSearchStore.clear}>
                                Сбросить
                            </Button>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Button className={b('cancel-btn')} onClick={this.props.closeHandler}>
                                Отмена
                            </Button>
                            <Button className={b('find-btn')} onClick={userSearchStore.searchUser}>
                                Найти
                            </Button>
                        </React.Fragment>
                    )}
                </div>
                {userSearchStore.state === 'loading' && (
                    <React.Fragment>
                        <Preloader size={50} className={b('preloader')} />
                        <div className={b('preloader-overlay')} />
                    </React.Fragment>
                )}
            </Popup>
        );
    }

    private addUser = (id: number) => {
        if (userSearchStore.state === 'initial') {
            return;
        }

        const contact = userSearchStore.users.find(user => user.id === id);
        const hasContact = contactsStore.has(contact.username);

        if (hasContact) {
            return;
        }

        contactsStore.add(contact);
        this.props.closeHandler();
    };
}

export default AddContact;
