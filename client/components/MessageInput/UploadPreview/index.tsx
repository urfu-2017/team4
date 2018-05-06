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

@observer
class UploadPreview extends React.Component<Props> {
    private input: HTMLInputElement;

    public componentDidMount() {
        window.addEventListener('keypress', this.onEnterPress);
        this.input.focus();
    }

    public componentWillUnmount() {
        window.addEventListener('keypress', this.onEnterPress);
    }

    public render() {
        const { className = '', loading = false, image, closeHandler, error, onSend } = this.props;

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
                    innerRef={this.ref}
                />
                <div className={b('buttons')}>
                    <Button className={b('cancel-button')} onClick={closeHandler}>
                        Отменить
                    </Button>
                    <Button
                        disabled={loading || error}
                        className={b('send-button')}
                        onClick={onSend}
                    >
                        Отправить
                    </Button>
                </div>
            </Popup>
        );
    }

    private ref = node => {
        this.input = node;
        this.props.inputRef(node);
    };

    private onEnterPress = event => {
        event.stopPropagation();
        if (event.key === 'Enter') {
            this.props.onSend();
        }
    };
}

export default UploadPreview;
