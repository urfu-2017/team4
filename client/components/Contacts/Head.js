import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import contactsStore from '../../domain/contacts-store';

const Head = ({ closeHandler }) => (
    <React.Fragment>
        <h2 className="contacts__heading header3">Контакты</h2>
        <div className="contacts__header-buttons">
            {contactsStore.state === 'loaded' && (
                <Button className="contacts__edit" type="heading">
                    Изменить
                </Button>
            )}
            <Button className="contacts__close" onClick={closeHandler} type="heading">
                Закрыть
            </Button>
        </div>
    </React.Fragment>
);

Head.propTypes = {
    closeHandler: PropTypes.func.isRequired
};

export default Head;
