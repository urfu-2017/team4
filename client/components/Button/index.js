import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const classes = {
    main: 'btn_theme_main',
    heading: 'btn_theme_heading'
};

const Button = ({ children, onClick, className, type, disabled }) => (
    <button className={`${className} ${classes[type]}`} onClick={onClick} disabled={disabled}>
        {children}
    </button>
);

Button.propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node,
    type: PropTypes.oneOf(['main', 'heading']),
    disabled: PropTypes.bool
};

Button.defaultProps = {
    className: '',
    children: [],
    type: 'main',
    onClick: () => {},
    disabled: false
};

export default Button;
