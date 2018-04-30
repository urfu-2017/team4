import { observer } from 'mobx-react';
import Picker from 'react-emojipicker';
import React from 'react';
import PropTypes from 'prop-types';


import './index.css';

import uiStore from '../../domain/ui-store';

interface Props {
    className?: string;
}

@observer
class EmojiPicker extends React.Component<Props> {
    public componentDidMount() {
        uiStore.pushPopup(this.props.className);
    }

    public componentWillUnmount() {
        uiStore.popPopup();
    }

    public logEmoji (emoji) {
        console.log(emoji)
    }

    public render() {
        return (
            <React.Fragment>
                <section
                    className='emojipicker'
                    style={{ zIndex: 100 }}
                >
                    <Picker
                        onEmojiSelected={this.logEmoji.bind(this)}
                        modal={true}
                    />
                </section>
            </React.Fragment>
        );
    }
} 

export default EmojiPicker;

