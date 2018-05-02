import { observer } from 'mobx-react';
import React from 'react';

import Overlay from '../Overlay';
import './Popup.css';

import uiStore from '../../domain/ui-store';

interface Props {
    closeHandler: () => void;

    className?: string;
    zIndex?: number;
    headContent?: React.ReactNode;
}

@observer
class Popup extends React.Component<Props> {
    public componentDidMount() {
        uiStore.pushPopup(this.props.className);
    }

    public componentWillUnmount() {
        uiStore.popPopup();
    }

    public render() {
        const zIndex = this.props.zIndex + 1;
        const className = `popup ${this.props.className}`;

        return (
            <React.Fragment>
                <section className={className} style={{ zIndex }}>
                    {this.props.headContent && (
                        <header className="popup__head">{this.props.headContent}</header>
                    )}
                    {this.props.children}
                </section>
                {uiStore.topPopup === this.props.className && (
                    <Overlay closeHandler={this.props.closeHandler} zIndex={this.props.zIndex} />
                )}
            </React.Fragment>
        );
    }
}

export default Popup;
