import React from 'react';
import b_ from 'b_';
import { observer } from 'mobx-react';

import Preloader from '../../Preloader/index';
import Popup from '../../Popup';
import Input from '../../Input';
import Button from '../../Button';

import './UploadPreview.css';

const b = b_.with('preview');

interface Props {
    className?: string;
    loading?: boolean;
    image: HTMLImageElement;
    error?: boolean;

    inputRef?: (node: HTMLInputElement) => void;
    closeHandler: () => void;
    onSend: () => void;
}

const UploadPreview: React.SFC<Props> = observer(
    ({ className = '', loading = false, image, closeHandler, error, onSend, inputRef }) => {
        const ImageElement = React.createElement('img', {
            src: image.src,
            className: b('image')
        });

        return (
            <Popup className={`${b()} ${className}`} closeHandler={closeHandler} zIndex={100}>
                <div className={b('image-container')}>
                    {ImageElement}
                    {loading && (
                        <div className={b('overlay')}>
                            <Preloader size={50} className={b('preloader')} />
                        </div>
                    )}
                    {error && (
                        <div className={b('overlay')}>
                            <p className={b('error')}>При загрузке картинки произошла ошибка</p>
                        </div>
                    )}
                </div>
                <Input
                    type="text"
                    className={b('message')}
                    placeholder="Добавьте подпись..."
                    innerRef={inputRef}
                />
                <div className={b('buttons')}>
                    <Button
                        disabled={loading || error}
                        className={b('send-button')}
                        onClick={onSend}
                    >
                        Отправить
                    </Button>
                    <Button className={b('cancel-button')} onClick={closeHandler}>
                        Отменить
                    </Button>
                </div>
            </Popup>
        );
    }
);

export default UploadPreview;
