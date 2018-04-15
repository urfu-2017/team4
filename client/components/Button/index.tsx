import React from 'react';
import './Button.css';

const classes = {
    main: 'btn_theme_main',
    heading: 'btn_theme_heading'
};

interface Props {
    className?: string;
    type?: 'main' | 'heading';
    disabled?: boolean;
    onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}

const Button: React.SFC<Props> = ({
    children,
    onClick,
    className = '',
    type = 'main',
    disabled
}) => (
    <button className={`${className} ${classes[type]}`} onClick={onClick} disabled={disabled}>
        {children}
    </button>
);

export default Button;
