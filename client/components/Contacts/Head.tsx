import React from 'react';
import b_ from 'b_';

import Button from '../Button';

const b = b_.with('contacts');

interface Props {
    closeHandler: () => void;
}

const Head: React.SFC<Props> = ({ closeHandler }) => (
    <React.Fragment>
        <h2 className={`${b('heading')} header3`}>Контакты</h2>
        <div className={b('header-buttons')}>
            <Button className={b('close')} onClick={closeHandler} type="heading">
                Закрыть
            </Button>
        </div>
    </React.Fragment>
);

export default Head;
