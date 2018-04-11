import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';

const Head = ({ closeHandler }) => (
    <React.Fragment>
        <h2 className="profile__heading header3">Настройки</h2>
        <Button className="profile__close" onClick={closeHandler} type="heading">
            Закрыть
        </Button>
    </React.Fragment>
);

Head.propTypes = {
    closeHandler: PropTypes.func.isRequired
};

export default Head;
