import { observer } from 'mobx-react';
import { Picker } from 'emoji-mart';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './index.css';
import 'emoji-mart/css/emoji-mart.css';

import ogStore from '../../domain/og-store';
import urlParser from '../../utils/url-parser';
import uiStore from '../../domain/ui-store';

interface Props {
    addSmile: (smile) => void;
    closeSmiles: () => void;
}

class EmojiPicker extends React.Component<Props, any> {

    public getEmoji = (emoji) => {
        return this.props.addSmile(emoji.native);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, false);
    }

    componentWillMount() {
        document.addEventListener('click', this.handleClickOutside, false);
    }
    
    handleClickOutside = (event) => {
        const domNode = ReactDOM.findDOMNode(this);
    
        if ((!domNode || !domNode.contains(event.target))) {
            this.props.closeSmiles();
        }
    }      

    public render() {
        return (
            <React.Fragment>
                <div className='emojipicker'>
                    <Picker 
                        set='emojione'
                        showPreview={false}
                        showSkinTones={false}
                        onSelect={this.getEmoji}
                        color='#515151'
                    />
                </div>
            </React.Fragment>
        );
    }
} 

export default EmojiPicker;

