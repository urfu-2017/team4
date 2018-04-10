import React from 'react';
import PropTypes from 'prop-types';
import './PopupHead.css';

class PopUpHead extends React.Component {
    render() {
        return (
            <header className={`popup__head ${this.props.className}`}>
                {this.props.children}
            </header>
        );
    }
}

PopUpHead.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};

PopUpHead.defaultProps = {
    className: ''
};

export default PopUpHead;
