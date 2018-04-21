import React from 'react';
import b_ from 'b_';

import Button from '../Button';

const b = b_.with('profile');

interface Props {
    closeHandler: () => void;
}

const Head: React.SFC<Props> = ({ closeHandler }) => (
    <React.Fragment>
        <h2 className={`${b('heading')} header3`}>Настройки</h2>
        <Button className={b('close')} onClick={closeHandler} type="heading">
            Закрыть
        </Button>
    </React.Fragment>
);

export default Head;
