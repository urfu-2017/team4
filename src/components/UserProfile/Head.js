import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';

const Head = ({ closeHandler }) => (
    <React.Fragment>
        <h2 className="profile__heading header3">
            Профиль
        </h2>
        <Button type="heading" onClick={closeHandler}>
            Закрыть
        </Button>
    </React.Fragment>
);

Head.propTypes = {
    closeHandler: PropTypes.func.isRequired
};

export default Head;
