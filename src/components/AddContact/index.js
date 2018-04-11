import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Button from '../Button';
import Contact from '../Contact';
import Search from './Search';
import Preloader from '../Preloader';
import Popup from '../Popup';
import './AddContact.css';

import contactsStore from '../../domain/contacts-store';
import userSearchStore from '../../domain/user-search-store';

@observer
class AddContact extends React.Component {
    componentWillUnmount() {
        userSearchStore.clear();
    }

    addUser = () => {
        if (userSearchStore.state === 'initial') {
            return;
        }

        contactsStore.add(userSearchStore.user);
        userSearchStore.clear();
        this.props.closeHandler();
    };

    render() {
        return (
            <Popup
                className="add-contact"
                closeHandler={this.props.closeHandler}
                zIndex={200}
            >
                <h2 className="add-contact__heading header3">Добавить контакт</h2>
                <div className="add-contact__search-zone">
                    {
                        userSearchStore.state === 'loaded' ? (
                            <Contact {...userSearchStore.user}/>
                        ) : (
                            <Search/>
                        )
                    }
                </div>
                <div className="add-contact__buttons">
                    {
                        userSearchStore.state === 'loaded' ? (
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
                                <Button className="add-contact__cancel-btn" onClick={this.props.closeHandler}>
                                    Отмена
                                </Button>
                                <Button className="add-contact__find-btn" onClick={userSearchStore.searchUser}>
                                    Найти
                                </Button>
                            </React.Fragment>
                        )
                    }
                </div>
                {
                    userSearchStore.state === 'loading' &&
                    <React.Fragment>
                        <Preloader size={50} className="add-contact__preloader"/>
                        <div className="add-contact__preloader-overlay"/>
                    </React.Fragment>
                }
            </Popup>
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
