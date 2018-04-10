import React from 'react';
import PropTypes from 'prop-types';

import PopupHead from '../PopupHead';
import Button from '../Button';
import contactsStore from '../../domain/contacts-store';

const Head = ({ closeHandler }) => (
    <PopupHead className="contacts__head">
        <h2 className="contacts__heading header3">Контакты</h2>
        <div className="contacts__header-buttons">
            {
                contactsStore.state === 'loaded' &&
                <Button className="contacts__edit" type="heading">
                    Изменить
                </Button>
            }
            <Button className="contacts__close" onClick={closeHandler} type="heading">
                Закрыть
            </Button>
        </div>
    </PopupHead>
);

Head.propTypes = {
    closeHandler: PropTypes.func.isRequired
};

export default Head;
