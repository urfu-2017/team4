import React from 'react';

import Button from '../Button';

interface Props {
    closeHandler: () => void;
}

const Head: React.SFC<Props> = ({ closeHandler }) => (
    <React.Fragment>
        <h2 className="profile__heading header3">Профиль</h2>
        <Button type="heading" onClick={closeHandler}>
            Закрыть
        </Button>
    </React.Fragment>
);

export default Head;
