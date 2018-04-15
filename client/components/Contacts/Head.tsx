import React from 'react';

import contactsStore from '../../domain/contacts-store';
import Button from '../Button';

interface Props {
    closeHandler: () => void;
}

const Head: React.SFC<Props> = ({ closeHandler }) => (
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

export default Head;
