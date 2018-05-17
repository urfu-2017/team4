import React from 'react';
import b_ from 'b_';
import { observer } from 'mobx-react';

import Popup from '../Popup';
import Button from '../Button';

import uiStore from '../../domain/ui-store';

import './ImageViewer.css';

const b = b_.with('image-viewer');

interface Props {
    closeHandler: () => void;
    src: string;
}

const ImageViewer: React.SFC<Props> = ({ closeHandler, src }) => (
    <Popup closeHandler={closeHandler} zIndex={100} className={b({ dark: uiStore.isDark })}>
        <div className={b('container')}>
            <img src={src} alt="Изображение" className={b('image')} />
        </div>
        <Button type={uiStore.isDark ? 'dark' : 'main'} onClick={closeHandler}>Закрыть</Button>
    </Popup>
);

export default observer(ImageViewer);
