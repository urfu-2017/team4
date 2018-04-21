import React from 'react';
import b_ from 'b_';
import './Button.css';

const classes = {
    main: { theme: 'main' },
    heading: { theme: 'heading' }
};

const b = b_.with('button');

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
    <button className={`${className} ${b(classes[type])}`} onClick={onClick} disabled={disabled}>
        {children}
    </button>
);

export default Button;
