import React from 'react';
import b_ from 'b_';
import { observer } from 'mobx-react';

import uiStore from '../../domain/ui-store';

import './Toast.css';
const b = b_.with('toast');

@observer
class Toast extends React.Component {

    public render(): React.ReactNode {
        if (!uiStore.error) {
            return null;
        }

        return (
            <div onClick={this.onClick} key={uiStore.error} className={b()}>{uiStore.error}</div>
        );
    }

    private onClick = () => uiStore.resetError();
}

export default Toast;
