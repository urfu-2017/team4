import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const classes = {
    main: 'btn_theme_main',
    heading: 'btn_theme_heading',
    dialogs: 'btn_theme_dialogs'
};

const Button = ({ children, onClick, className, type }) => (
    <button className={`${className} ${classes[type]}`} onClick={onClick}>
        {children}
    </button>
);

Button.propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node,
    type: PropTypes.oneOf(['main', 'heading', 'dialogs'])
};

Button.defaultProps = {
    className: '',
    children: [],
    type: 'main',
    onClick: () => {}
};

export default Button;
