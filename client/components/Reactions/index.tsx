import React from 'react';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import b_ from 'b_';

import uiStore from '../../domain/ui-store';

import EmojiPicker from '../EmojiPicker';
import Reaction from './Item';
import Popup from '../Popup';

import './Reactions.css';
const b = b_.with('reactions');

interface Props {
    reactions: any[];
    onClick: (smile: string) => void;
}

@observer
class Reactions extends React.Component<Props> {
    @observable private showPicker: boolean = false;

    @computed
    private get reactions(): any[] {
        const reactions: Record<string, { count: number }> = {};

        for (const reaction of this.props.reactions) {
            const rcn = reactions[reaction.reaction] || {
                smile: reaction.reaction,
                count: 0,
                id: reaction.id
            };
            rcn.count++;
            reactions[reaction.reaction] = rcn;
        }

        return Object.values(reactions).sort((r1, r2) => r1.count - r2.count);
    }

    public render(): React.ReactNode {
        const dark = uiStore.isDark;

        return (
            <React.Fragment>
                <div className={b()}>
                    <div className={b('list')}>
                        {this.reactions.map(reaction => (
                            <Reaction
                                key={reaction.id}
                                reaction={reaction}
                                onClick={this.onClick}
                            />
                        ))}
                    </div>
                    <span onClick={this.onShowPicker} className={b('item', { plus: true, dark })}>
                        +
                    </span>
                </div>
                {this.showPicker && (
                    <Popup className={b('popup')} closeHandler={this.onHidePicker} zIndex={100}>
                        <EmojiPicker
                            className={b('picker')}
                            addSmile={this.onClick}
                        />
                    </Popup>
                )}
            </React.Fragment>
        );
    }

    @action private onShowPicker = () => (this.showPicker = true);

    @action private onHidePicker = () => (this.showPicker = false);

    @action
    private onClick = smile => {
        this.props.onClick(smile);
        this.showPicker = false;
    };
}

export default Reactions;
