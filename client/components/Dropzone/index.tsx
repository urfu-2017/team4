import React from 'react';
import { action, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import ReactDropzone from 'react-dropzone';

interface Props {
    className?: string;
    overClassName?: string;
    onWindowClassName?: string;
    children?: React.ReactNode;
    accept?: string;
    disabled?: boolean;

    dropzoneRef?: (Dropzone) => void;
    onDrop?: (accepted: File[], rejected?: File[]) => void;
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
            className,
            overClassName,
            onWindowClassName,
            children,
            dropzoneRef,
            onDrop,
            accept,
            disabled
        } = this.props;

        return (
            <ReactDropzone
                ref={dropzoneRef}
                className={classNames(
                    className,
                    { [overClassName]: this.isDragOnZone },
                    { [onWindowClassName]: this.displayDropzone }
                )}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                onDrop={onDrop}
                accept={accept}
                disabled={disabled}
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
            this.isDragOnZone = false;
        });
        this.childrenDepth = 0;
    };
}

export default Dropzone;
