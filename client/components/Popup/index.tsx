import { observer } from 'mobx-react';
import React from 'react';
import b_ from 'b_';
import classNames from 'classnames';

import Overlay from '../Overlay';
import './Popup.css';

import uiStore from '../../domain/ui-store';

const b = b_.with('popup');

interface Props {
    closeHandler: () => void;

    className?: string;
    zIndex?: number;
    headContent?: React.ReactNode;
    dark?: boolean;
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
        const { className, headContent, children, closeHandler, dark } = this.props;

        const zIndex = this.props.zIndex + 1;

        return (
            <React.Fragment>
                <section className={classNames(b({ dark }), className)} style={{ zIndex }}>
                    {headContent && (
                        <header className={b('head', { dark })}>{headContent}</header>
                    )}
                    {children}
                </section>
                {uiStore.topPopup === className && (
                    <Overlay closeHandler={closeHandler} zIndex={this.props.zIndex} />
                )}
            </React.Fragment>
        );
    }
}

export default Popup;
