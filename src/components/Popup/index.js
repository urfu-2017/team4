import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Overlay from '../Overlay';
import './Popup.css';

import uiStore from '../../domain/ui-store';

@observer
class Popup extends React.Component {
    componentDidMount() {
        uiStore.pushPopup(this.props.className);
    }

    componentWillUnmount() {
        uiStore.popPopup();
    }

    render() {
        return (
            <React.Fragment>
                <section
                    className={`popup ${this.props.className}`}
                    style={{ zIndex: this.props.zIndex + 1 }}
                >
                    {this.props.children}
                </section>
                {
                    uiStore.topPopup === this.props.className &&
                    <Overlay
                        closeHandler={this.props.closeHandler}
                        zIndex={this.props.zIndex}
                    />
                }
            </React.Fragment>
        );
    }
}

Popup.propTypes = {
    zIndex: PropTypes.number.isRequired,
    className: PropTypes.string,
    children: PropTypes.node,
    closeHandler: PropTypes.func.isRequired
};

Popup.defaultProps = {
    children: [],
    className: ''
};

export default Popup;
