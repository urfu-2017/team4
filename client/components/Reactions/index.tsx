import React from 'react';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import b_ from 'b_';

import EmojiPicker from '../EmojiPicker';
import Reaction from './Item';

import './Reactions.css';
const b = b_.with('reactions');

interface Props {
    reactions: any[];
    onClick: (smile: string) => void;
}

@observer
class Reactions extends React.Component<Props> {

    @observable
    private showPicker: boolean = false;

    @computed
    private get reactions(): any[] {
        return this.props.reactions;
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <div className={b()}>
                    <div className={b('list')}>
                        {
                            this.reactions.map(reaction =>
                                <Reaction
                                    key={reaction.id}
                                    reaction={reaction}
                                    onClick={this.onClick}
                                />
                            )
                        }
                    </div>
                    <span onClick={this.onShowPicker} className={b('item', { plus: true })}>+</span>
                </div>
                {this.showPicker && (
                    <EmojiPicker
                        className={b('picker')}
                        addSmile={this.onClick}
                        closeSmiles={this.onHidePicker}
                    />
                )}
            </React.Fragment>
        );
    }

    private onShowPicker = () => this.showPicker = true;
    private onHidePicker = () => this.showPicker = false;

    private onClick = smile => {
        this.props.onClick(smile);
        this.showPicker = false;
    }
}

export default Reactions;
