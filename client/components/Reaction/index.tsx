import { computed, reaction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';
import b_ from 'b_';

import './index.css';

const b = b_.with('reaction');

interface Props {
    messageId: any;
    reaction: any;
}

@observer
class Reaction extends React.Component<Props> {
    private reactionCount: HTMLElement;

    public render() {
        const { reaction, messageId } = this.props;
        const addCount = () => {
            reaction.count++;
            this.reactionCount.innerHTML = reaction.count;
        };
        return (
            <React.Fragment>
                <div
                    className={b('item')}
                    onClick={addCount}
                >
                    <span
                        className={b('item-count')}
                        ref={el => this.reactionCount = el}
                    >
                        {reaction.count}
                    </span>
                    <span className={b('item-smile')}>{reaction.smile}</span>
                </div>
            </React.Fragment>
        );
    }
}

export default Reaction;