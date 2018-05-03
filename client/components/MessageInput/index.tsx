import { observer } from 'mobx-react';
import React from 'react';
import Textarea from 'react-textarea-autosize';
import b_ from 'b_';
import ReactDropzone from 'react-dropzone';

import EmojiPicker from '../EmojiPicker';
import Button from '../Button';

import SendIcon from './SendIcon';
import AttachIcon from './AttachIcon';
import EmojiIcon from './EmojiIcon';

import Dropzone from '../Dropzone';

import ChatsStore from '../../domain/chats-store';
import ogStore from '../../domain/og-store';
import urlParser from '../../utils/url-parser';
import { getImageFromFile } from '../../utils/image-utils';

import './MessageInput.css';
const b = b_.with('message-input');

interface State {
    showSmiles: boolean;
}

@observer
class MessageInput extends React.Component<{}, State> {

    private messageInput: HTMLTextAreaElement;
    private dropzone: ReactDropzone;

    constructor(props) {
        super(props);

        this.state = {
            showSmiles: false
        }
    }

    public onSend = async () => {
        const text = this.messageInput.value.trim();
        const ogData = ogStore.data;

        if (!text) {
            return;
        }

        try {
            this.messageInput.disabled = true;
            await ChatsStore.currentChat.sendMessage(text, ogData);
            ogStore.clear();
            this.messageInput.value = null;
        } finally {
            this.messageInput.disabled = false;
            this.messageInput.focus();
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

    public onInput = event => {
        const url = urlParser(event.target.value);

        if (url) {
            ogStore.setUrl(url);
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
                        <EmojiIcon className={`${b('icon')} ${b('emoji-icon')}`}/>
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
                {/* TODO запилить обработчики на перехват файлов */}
                <Dropzone
                    // tslint:disable-next-line
                    dropzoneRef={node => {
                        this.dropzone = node;
                    }}
                    blockName={b()}
                    // tslint:disable-next-line
                    onDrop={(accepted) => {
                        getImageFromFile(accepted[0]).then(res => console.log(res));
                    }}
                    accept="image/jpeg, image/gif, image/png, image/webp, image/svg+xml"
                >
                    Перетащите фото для отправки
                </Dropzone>
            </section>
        );
    }

    private dropzoneOpen = (): void => {
        this.dropzone.open();
    };
}

export default MessageInput;
