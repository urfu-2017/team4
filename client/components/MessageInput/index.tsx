import { observer } from 'mobx-react';
import { observable, runInAction } from 'mobx';
import React from 'react';
import Textarea from 'react-textarea-autosize';
import b_ from 'b_';
import ReactDropzone from 'react-dropzone';

import EmojiPicker from '../EmojiPicker';
import Button from '../Button';

import UploadPreview from './UploadPreview';
import SendIcon from './SendIcon';
import AttachIcon from './AttachIcon';
import EmojiIcon from './EmojiIcon';
import Dropzone from '../Dropzone';

import ChatsStore from '../../domain/chats-store';
import UploadStore from '../../domain/upload-store';
import { getImageFromFile, resizeImage } from '../../utils/image-utils';
import { BASE_URL } from '../../config';

import './MessageInput.css';
const b = b_.with('message-input');

interface State {
    showSmiles: boolean;
}

@observer
class MessageInput extends React.Component<{}, State> {
    @observable private preview: HTMLImageElement;
    private imageCaptionInput: HTMLInputElement;
    private messageInput: HTMLTextAreaElement;
    private dropzone: ReactDropzone;

    private uploadStore: UploadStore = new UploadStore();
    private attachment: string;

    constructor(props) {
        super(props);

        this.state = {
            showSmiles: false
        };
    }

    public onSend = async () => {
        const text = this.messageInput.value.trim();

        if (!text) {
            return;
        }

        try {
            this.messageInput.disabled = true;
            await ChatsStore.currentChat.sendMessage(text, null);
            this.messageInput.value = null;
        } finally {
            this.messageInput.disabled = false;
        }
    };

    public onShowSmiles = () => {
        this.setState(prev => ({
            showSmiles: !prev.showSmiles
        }));
    };

    public onCloseSmiles = () => {
        this.setState({
            showSmiles: false
        });
    };

    public addSmile = smile => {
        this.messageInput.value += smile;
    };

    public onKeyUp = event => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.onSend();
        }
    };

    public render() {
        return (
            <section className={b()}>
                <Button className={b('button')} onClick={this.dropzoneOpen}>
                    <AttachIcon className={`${b('icon')} ${b('attach-icon')}`} />
                </Button>
                <Textarea
                    maxRows={6}
                    style={{ padding: '10px' }}
                    className={b('message')}
                    placeholder="Введите сообщение..."
                    onKeyPress={this.onKeyUp}
                    inputRef={input => (this.messageInput = input) /* tslint:disable-line */}
                />
                <div className={b('smiles')}>
                    <Button onClick={this.onShowSmiles} className={b('button')}>
                        <EmojiIcon className={`${b('icon')} ${b('emoji-icon')}`} />
                    </Button>
                    {this.state.showSmiles && (
                        <EmojiPicker
                            className={b('smiles-picker')}
                            addSmile={this.addSmile}
                            closeSmiles={this.onCloseSmiles}
                        />
                    )}
                </div>
                <Button className={`${b('button')} ${b('send')}`} onClick={this.onSend}>
                    <SendIcon className={`${b('icon')} ${b('send-icon')}`} />
                </Button>
                <Dropzone
                    // tslint:disable-next-line
                    dropzoneRef={node => {
                        this.dropzone = node;
                    }}
                    className={b('dropzone')}
                    onWindowClassName={b('dropzone', { display: true })}
                    overClassName={b('dropzone', { over: true })}
                    onDrop={this.onDrop}
                    accept="image/jpeg, image/gif, image/png, image/webp, image/svg+xml"
                >
                    Перетащите фото рамером не более 20мб для отправки.
                </Dropzone>
                {this.preview && (
                    <UploadPreview
                        image={this.preview}
                        loading={this.uploadStore.isFetching}
                        error={this.uploadStore.isError}
                        closeHandler={this.onUploadCancel}
                        onSend={this.onImageSend}
                        // tslint:disable-next-line
                        inputRef={node => {
                            this.imageCaptionInput = node;
                        }}
                    />
                )}
            </section>
        );
    }

    private onImageSend = async () => {
        const text = this.imageCaptionInput.value.trim();

        try {
            this.imageCaptionInput.disabled = true;
            await ChatsStore.currentChat.sendMessage(text, this.attachment);
            this.imageCaptionInput.value = '';
        } finally {
            this.imageCaptionInput.disabled = false;
            this.imageCaptionInput.focus();
            this.onUploadCancel();
        }
    };

    private dropzoneOpen = (): void => {
        this.dropzone.open();
    };

    private onDrop = (accepted: File[]): void => {
        let resize;

        if (accepted[0].type === 'image/svg+xml') {
            resize = Promise.resolve(accepted[0]);
        } else {
            resize = resizeImage(accepted[0], 720);
        }

        resize.then(file =>
            getImageFromFile(file).then(image => {
                this.uploadStore.upload(file).then(({ path }) => {
                    this.attachment = `${BASE_URL}${path}`;
                });
                runInAction(() => {
                    if (this.preview) {
                        return;
                    }

                    this.preview = image;
                });
            })
        );
    };

    private onUploadCancel = (): void => {
        this.attachment = undefined;
        this.preview = undefined;
        this.uploadStore.clear();
    };
}

export default MessageInput;
