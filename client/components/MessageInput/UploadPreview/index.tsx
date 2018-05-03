import React from 'react';
import b_ from 'b_';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import Preloader from '../../Preloader/index';

import './UploadPreview.css';

const b = b_.with('preview');

interface Props {
    className?: string;
    loading?: boolean;
    image: HTMLImageElement;
    closeHandler?: () => void;
    error?: boolean;
}

@observer
class UploadPreview extends React.Component<Props> {
    @observable private collapsed: boolean = false;

    public render() {
        const { className = '', image, closeHandler, loading = false, error } = this.props;
        const ImageElement = React.createElement('img', {
            src: image.src,
            className: b('image')
        });

        return (
            <div className={`${b({ collapsed: this.collapsed })} ${className}`}>
                {ImageElement}
                <button onClick={this.onCollapse} className={b('collapse')} title="Свернуть" />
                <button onClick={closeHandler} className={b('close')} title="Отменить" />
                {loading && (
                    <div className={b('overlay', { display: !this.collapsed })}>
                        <Preloader size={50} className={b('preloader')} />
                    </div>
                )}
                {error && (
                    <div className={b('overlay', { display: !this.collapsed })}>
                        <p className={b('message')}>При загрузке картинки произошла ошибка</p>
                    </div>
                )}
            </div>
        );
    }

    @action
    private onCollapse = () => {
        this.collapsed = !this.collapsed;
    };
}

export default UploadPreview;
