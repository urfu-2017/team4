import React from 'react';
import PropTypes from 'prop-types';

import PopupHead from '../PopupHead';
import Button from '../Button';

const Head = ({ closeHandler }) => (
    <PopupHead className="profile__head">
        <h2 className="profile__heading header3">Настройки</h2>
        <Button className="profile__close" onClick={closeHandler} type="heading">
            Закрыть
        </Button>
    </PopupHead>
);

Head.propTypes = {
    closeHandler: PropTypes.func.isRequired
};

export default Head;
