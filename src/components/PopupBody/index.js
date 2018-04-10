import React from 'react';
import PropTypes from 'prop-types';
import './PopupBody.css';

class PopupBody extends React.Component {
    render() {
        return (
            <main className={`popup__body ${this.props.className}`}>
                {this.props.children}
            </main>
        );
    }
}

PopupBody.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
};

PopupBody.defaultProps = {
    children: [],
    className: ''
};

export default PopupBody;
