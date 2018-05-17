import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import React from 'react';
import Textarea from 'react-textarea-autosize';
import b_ from 'b_';
import ReactDropzone from 'react-dropzone';

import EmojiPicker from '../EmojiPicker';
import Button from '../Button';
import Recognition from './Recognition';

import ForwardedContainer from '../ForwardedMessage/Container';
import UploadPreview from './UploadPreview';
import SendIcon from './SendIcon';
import AttachIcon from './AttachIcon';
import EmojiIcon from './EmojiIcon';
import Dropzone from '../Dropzone';

import uiStore from '../../domain/ui-store';
import ChatsStore from '../../domain/chats-store';
import UploadStore from '../../domain/upload-store';
import { getImageFromFile, resizeImage } from '../../utils/image-utils';
import { withOutsideClickHandler } from '../../hocs/withOutsideClickHandler';
import { BASE_URL } from '../../config';

import './MessageInput.css';
const b = b_.with('message-input');

interface PickerProps {
    addSmile: (smile) => void;
    className?: string;
}

@observer
class MessageInput extends React.Component {
    @observable private preview: HTMLImageElement;
    @observable private showSmiles: boolean = false;
    @observable private message: string = '';

    private messageInput: HTMLTextAreaElement;
    private imageCaptionInput: HTMLInputElement;
    private dropzone: ReactDropzone;

    private uploadStore: UploadStore = new UploadStore();
    private attachment: string;

    constructor(props) {
        super(props);
    }

    public onSend = async () => {
        const text = this.message.trim();

        if (!text) {
            return;
        }

        let timeToDeath = null;
        // FIXME пока нет контролов
        if (Number(text)) {
            timeToDeath = Number(text);
        }

        await ChatsStore.currentChat.sendMessage(text, null, timeToDeath);
        this.setMessage('');
        this.messageInput.focus();
    };

    public onKeyUp = event => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.onSend();
        }
    };

    public render() {
        const dark = uiStore.isDark;
        const MessageInputEmojiPicker: React.ComponentClass<PickerProps> = withOutsideClickHandler(
            EmojiPicker,
            this.onCloseSmiles
        );

        return (
            <section className={b({ dark })}>
                {this.renderForwardedContainer()}
                <div className={b('container')}>
                    <Button className={b('button', { dark })} onClick={this.dropzoneOpen}>
                        <AttachIcon className={`${b('icon')} ${b('attach-icon')}`} />
                    </Button>
                    <Textarea
                        maxRows={6}
                        style={{ padding: '10px' }}
                        className={b('message', { dark })}
                        placeholder="Введите сообщение..."
                        onKeyPress={this.onKeyUp}
                        onChange={this.onChangeText}
                        value={this.message}
                        inputRef={el => (this.messageInput = el) /* tslint:disable-line */}
                    />
                    <Recognition onChange={this.onSpeech} />
                    <div className={b('smiles')}>
                        <Button onClick={this.onShowSmiles} className={b('button', { dark })}>
                            <EmojiIcon className={`${b('icon')} ${b('emoji-icon')}`} />
                        </Button>
                        {this.showSmiles && (
                            <MessageInputEmojiPicker
                                className={b('smiles-picker')}
                                addSmile={this.onAddSmile}
                            />
                        )}
                    </div>
                    <Button
                        className={`${b('button', { dark })} ${b('send')}`}
                        onClick={this.onSend}
                    >
                        <SendIcon className={`${b('icon')} ${b('send-icon')}`} />
                    </Button>
                </div>
                <Dropzone
                    // tslint:disable-next-line
                    dropzoneRef={node => {
                        this.dropzone = node;
                    }}
                    className={b('dropzone')}
                    onWindowClassName={b('dropzone') + '_display'}
                    overClassName={b('dropzone') + '_over'}
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

    private renderForwardedContainer() {
        if (!uiStore.forwardMessage || uiStore.displays.selectChat) {
            return null;
        }

        return (
            <div className={b('forwarded')}>
                <ForwardedContainer message={uiStore.forwardMessage} />
            </div>
        );
    }

    private onImageSend = async () => {
        const text = this.imageCaptionInput.value.trim();

        try {
            this.imageCaptionInput.disabled = true;
            await ChatsStore.currentChat.sendMessage(text, this.attachment, null);
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

        if (accepted.length === 0) {
            uiStore.setToast('Формат загружаемого файла не поддерживается');
            return;
        }

        if (accepted[0].type === 'image/svg+xml') {
            resize = Promise.resolve(accepted[0]);
        } else {
            resize = resizeImage(accepted[0], 720);
        }

        resize
            .then(file =>
                getImageFromFile(file).then(image => {
                    this.uploadStore.upload(file).then(({ path }) => {
                        this.attachment = `${BASE_URL}${path}`;
                    });

                    if (this.preview) {
                        return;
                    }

                    runInAction(() => {
                        this.preview = image;
                    });
                })
            )
            .catch(() => uiStore.setToast('Загрузка файла не удалась'));
    };

    private onSpeech = (text: string) => {
        this.setMessage(`${this.message} ${text}`.trim());
    };

    private onChangeText = (event: React.FormEvent<HTMLTextAreaElement>) => {
        this.setMessage(event.currentTarget.value);
    };

    @action
    private onUploadCancel = (): void => {
        this.attachment = undefined;
        this.preview = undefined;
        this.uploadStore.clear();
    };

    @action private onShowSmiles = () => (this.showSmiles = true);

    @action private onCloseSmiles = () => (this.showSmiles = false);

    @action private setMessage = (value: string) => (this.message = value);

    @action private onAddSmile = (text: string) => (this.message += text);
}

export default MessageInput;
