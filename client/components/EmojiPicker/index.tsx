import { Picker } from 'emoji-mart';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'emoji-mart/css/emoji-mart.css';

interface Props {
    addSmile: (smile) => void;
    closeSmiles: () => void;
    className?: string;
}

class EmojiPicker extends React.Component<Props, any> {
    public componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, false);
    }

    public componentWillMount() {
        document.addEventListener('click', this.handleClickOutside, false);
    }

    public render() {
        const { className = '' } = this.props;

        return (
            <React.Fragment>
                <div className={className}>
                    <Picker
                        set="google"
                        showPreview={false}
                        showSkinTones={false}
                        onSelect={this.getEmoji}
                        color="#515151"
                        emojiSize={24}
                        native={true}
                    />
                </div>
            </React.Fragment>
        );
    }

    private getEmoji = emoji => {
        return this.props.addSmile(emoji.native);
    };

    private handleClickOutside = event => {
        const domNode = ReactDOM.findDOMNode(this);

        if (!domNode || !domNode.contains(event.target)) {
            this.props.closeSmiles();
        }
    };
}

export default EmojiPicker;
