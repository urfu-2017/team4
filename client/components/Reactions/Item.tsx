import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';

import uiStore from '../../domain/ui-store';

const b = b_.with('reactions');

interface Props {
    reaction: any;
    onClick: (smile) => void;
}

@observer
class Reaction extends React.Component<Props> {
    public render() {
        const { smile, count } = this.props.reaction;
        const dark = uiStore.isDark;

        return (
            <React.Fragment>
                <div className={b('item', { dark })} onClick={this.onClick}>
                    <span className={b('item-count')}>{count}</span>
                    <span className={b('item-smile')}>{smile}</span>
                </div>
            </React.Fragment>
        );
    }

    private onClick = () => this.props.onClick(this.props.reaction.smile);
}

export default Reaction;
