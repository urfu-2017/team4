import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const types = {
    main: 'btn_main',
    heading: 'btn_modal-heading'
};

const Button = ({ children, onClick, className, type }) => (
    <button className={`${className} ${types[type]}`} onClick={onClick}>
        {children}
    </button>
);

Button.propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node,
    type: PropTypes.string
};

Button.defaultProps = {
    className: '',
    children: [],
    type: 'main',
    onClick: () => {}
};

export default Button;
