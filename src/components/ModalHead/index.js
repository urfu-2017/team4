import React from 'react';
import PropTypes from 'prop-types';
import './ModalHead.css';

class ModalHead extends React.Component {
    render() {
        return (
            <header className={`modal-head ${this.props.className}`}>
                {this.props.children}
            </header>
        );
    }
}

ModalHead.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};

ModalHead.defaultProps = {
    className: ''
};

export default ModalHead;
