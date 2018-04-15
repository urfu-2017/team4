import React from 'react';

import Button from '../Button';

interface Props {
    closeHandler: () => void;
}

const Head: React.SFC<Props> = ({ closeHandler }) => (
    <React.Fragment>
        <h2 className="profile__heading header3">Настройки</h2>
        <Button className="profile__close" onClick={closeHandler} type="heading">
            Закрыть
        </Button>
    </React.Fragment>
);

export default Head;
