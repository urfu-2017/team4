import React from 'react';
import PropTypes from 'prop-types';

import Overlay from '../Overlay';
import Button from '../Button';
import './AddContact.css';

class AddContact extends React.Component {
    render() {
        return (
            <React.Fragment>
                <section className="contacts__add-contact add-contact">
                    <h2 className="add-contact__heading header3">Добавить контакт</h2>
                    <input
                        type="text"
                        className="add-contact__input"
                        placeholder="Имя пользователя..."
                        ref={(input) => { this.usernameInput = input; }}
                    />
                    <div className="add-contact__buttons">
                        <Button className="add-contact__cancel" onClick={this.props.closeHandler}>
                            Отмена
                        </Button>
                        <Button className="add-contact__add">
                            Добавить
                        </Button>
                    </div>
                </section>
                <Overlay closeHandler={this.props.closeHandler} className="add-contact__overlay"/>
            </React.Fragment>
        );
    }
}

AddContact.propTypes = {
    closeHandler: PropTypes.func.isRequired
};

export default AddContact;
