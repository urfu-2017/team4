import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';

import Button from '../Button';
import Contact from '../Contact';
import Popup from '../Popup';
import Preloader from '../Preloader';
import './AddContact.css';
import Search from './Search';

import contactsStore from '../../domain/contacts-store';
import userSearchStore from '../../domain/user-search-store';

interface Props {
    closeHandler: () => void;
}

const b = b_.with('add-contact');

@observer
class AddContact extends React.Component<Props> {
    public componentWillUnmount() {
        userSearchStore.clear();
    }

    public addUser = () => {
        if (userSearchStore.state === 'initial') {
            return;
        }

        contactsStore.add(userSearchStore.user);
        userSearchStore.clear();
        this.props.closeHandler();
    };

    public render() {
        return (
            <Popup className={b()} closeHandler={this.props.closeHandler} zIndex={200}>
                <h2 className={`${b('heading')} header3`}>Добавить контакт</h2>
                <div className={b('search-zone')}>
                    {userSearchStore.state === 'loaded' ? (
                        <Contact {...userSearchStore.user}/>
                    ) : (
                        <Search className={b('input')}/>
                    )}
                </div>
                <div className={b('buttons')}>
                    {userSearchStore.state === 'loaded' ? (
                        <React.Fragment>
                            <Button className={b('clear-btn')} onClick={userSearchStore.clear}>
                                Сбросить
                            </Button>
                            <Button className={b('add-btn')} onClick={this.addUser}>
                                Добавить
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
                        <Preloader size={50} className={b('preloader')}/>
                        <div className={b('preloader-overlay')}/>
                    </React.Fragment>
                )}
            </Popup>
        );
    }
}

export default AddContact;
