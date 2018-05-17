import React from 'react'
import b_ from 'b_';

import Popup from '../Popup';

import './ImageViewer.css';

const b = b_.with('image-viewer');

interface Props {
    closeHandler: () => void;
    src: string
}

const ImageViewer: React.SFC<Props> = ({ closeHandler, src }) => (
    <Popup closeHandler={closeHandler} zIndex={100} className={b()}>
        <div className={b('container')}>
            <img src={src} alt="Изображение" className={b('image')}/>
        </div>
    </Popup>
);

export default ImageViewer;
