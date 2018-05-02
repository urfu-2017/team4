import React from 'react';
import { action, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import b from 'b_';
import ReactDropzone from 'react-dropzone';

interface Props {
    blockName?: string; // Имя блока, использующего зону
    children?: React.ReactNode;
    overModifier?: string; // Какой модификатор будет присутствовать при имени класса при переносе файла на зону
    onWindowModifier?: string; // Модификатор при переносе файла в окно браузера
    dropzoneRef?: (Dropzone) => void;
    onDrop?: (accepted: File[], rejected?: File[]) => void;
    accept?: string
}

@observer
class Dropzone extends React.Component<Props> {
    @observable private displayDropzone: boolean = false;
    @observable private isDragOnZone: boolean = false;
    private childrenDepth: number = 0;

    public componentDidMount() {
        window.addEventListener('dragenter', this.onWindowDragEnter);
        window.addEventListener('dragleave', this.onWindowDragLeave);
        window.addEventListener('drop', this.onWindowDrop);
    }

    public componentWillUnmount() {
        window.removeEventListener('dragenter', this.onWindowDragEnter);
        window.removeEventListener('dragleave', this.onWindowDragLeave);
        window.removeEventListener('drop', this.onWindowDrop);
    }

    public render() {
        const {
            blockName,
            children,
            overModifier,
            onWindowModifier,
            dropzoneRef,
            onDrop,
            accept
        } = this.props;

        return (
            <ReactDropzone
                ref={dropzoneRef}
                className={b(blockName, 'dropzone', {
                    [overModifier || 'over']: this.isDragOnZone,
                    [onWindowModifier || 'display']: this.displayDropzone
                })}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                onDrop={onDrop}
                accept={accept}
            >
                {children}
            </ReactDropzone>
        );
    }

    @action
    private onDragEnter = () => {
        this.isDragOnZone = true;
    };

    @action
    private onDragLeave = () => {
        this.isDragOnZone = false;
    };

    @action
    private onWindowDragEnter = event => {
        event.preventDefault();
        this.childrenDepth++;

        runInAction(() => {
            this.displayDropzone = true;
        });
    };

    @action
    private onWindowDragLeave = event => {
        event.preventDefault();
        this.childrenDepth--;

        if (this.childrenDepth === 0) {
            runInAction(() => {
                this.displayDropzone = false;
            });
        }
    };

    private onWindowDrop = event => {
        event.preventDefault();

        runInAction(() => {
            this.displayDropzone = false;
        });
        this.childrenDepth = 0;
    };
}

export default Dropzone;
