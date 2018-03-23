import React from 'react';
import PropTypes from 'prop-types';

import Overlay from '../overlay';
import MainBtn from '../main-btn';

class AddContact extends React.Component {
    constructor() {
        super();
        this.state = {
            username: ''
        };
        this.changeUsername = this.changeUsername.bind(this);
    }
    changeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }
    render() {
        return (
            <React.Fragment>
                <section className="contacts__add-contact add-contact">
                    <h2 className="add-contact__heading">Добавить контакт</h2>
                    <input
                        type="text"
                        className="add-contact__input"
                        placeholder="Имя пользователя..."
                        onChange={this.changeUsername}
                        />
                    <div className="add-contact__buttons">
                        <MainBtn className="add-contact__cancel" onClick={this.props.closeHandler}>
                            Отмена
                        </MainBtn>
                        <MainBtn className="add-contact__add">
                            Добавить
                        </MainBtn>
                    </div>
                </section>
                <Overlay closeHandler={this.props.closeHandler} className="add-contact__overlay" />
            </React.Fragment>
        );
    }
}

AddContact.propTypes = {
    closeHandler: PropTypes.func.isRequired
};

export default AddContact;
