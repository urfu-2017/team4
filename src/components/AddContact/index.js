import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Overlay from '../Overlay';
import Button from '../Button';
import Contact from '../Contact';
import Search from './Search';
import './AddContact.css';

import contactsStore from '../../domain/contacts-store';
import userSearchStore from '../../domain/user-search-store';

@observer
class AddContact extends React.Component {
    addUser = () => {
        if (userSearchStore.isAlreadyAdded) {
            return;
        }

        contactsStore.add(userSearchStore.user);
        userSearchStore.clear();
        this.props.closeHandler();
    };

    close = () => {
        userSearchStore.clear();
        this.props.closeHandler();
    };

    render() {
        return (
            <React.Fragment>
                <section className={`add-contact ${this.props.className}`}>
                    <h2 className="add-contact__heading header3">Добавить контакт</h2>
                    {
                        userSearchStore.isLoaded && userSearchStore.isFound ? (
                            <Contact {...userSearchStore.user}/>
                        ) : (
                            <Search/>
                        )
                    }
                    <div className="add-contact__buttons">
                        {
                            userSearchStore.isLoaded && userSearchStore.isFound ? (
                                <React.Fragment>
                                    <Button className="add-contact__clear-btn" onClick={userSearchStore.clear}>
                                        Сбросить
                                    </Button>
                                    <Button className="add-contact__add-btn" onClick={this.addUser}>
                                        Добавить
                                    </Button>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Button className="add-contact__cancel-btn" onClick={this.close}>
                                        Отмена
                                    </Button>
                                    <Button className="add-contact__find-btn" onClick={userSearchStore.searchUser}>
                                        Найти
                                    </Button>
                                </React.Fragment>
                            )
                        }
                    </div>
                </section>
                <Overlay closeHandler={this.close} className="add-contact__overlay"/>
            </React.Fragment>
        );
    }
}

AddContact.propTypes = {
    closeHandler: PropTypes.func.isRequired,
    className: PropTypes.string
};

AddContact.defaultProps = {
    className: ''
};

export default AddContact;
