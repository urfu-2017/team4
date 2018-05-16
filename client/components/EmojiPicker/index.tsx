import { Picker } from 'emoji-mart';
import React from 'react';
import classNames from 'classnames';
import b from 'b_';

import uiStore from '../../domain/ui-store';

import './EmojiPicker.css';
import 'emoji-mart/css/emoji-mart.css';

interface Props {
    addSmile: (smile) => void;
    className?: string;
}

class EmojiPicker extends React.Component<Props> {
    public render() {
        const { className = '' } = this.props;
        const dark = uiStore.isDark;

        return (
            <div className={classNames(className, b('picker', { dark }))}>
                <Picker
                    set="google"
                    showPreview={false}
                    showSkinTones={false}
                    onSelect={this.getEmoji}
                    color={dark ? '#ffffff' : '#515151'}
                    emojiSize={24}
                    native={true}
                />
            </div>
        );
    }

    private getEmoji = emoji => {
        return this.props.addSmile(emoji.native);
    };
}

export default EmojiPicker;
