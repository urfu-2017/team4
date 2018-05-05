import React from 'react';
import b_ from 'b_';
import './Button.css';

const modifiers = {
    main: { theme: 'main' },
    heading: { theme: 'heading' }
};

const b = b_.with('button');

interface Props {
    className?: string;
    type?: 'main' | 'heading';
    disabled?: boolean;
    onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
    tabIndex?: number;
}

const Button: React.SFC<Props> = ({
    children,
    onClick,
    className = '',
    type = 'main',
    disabled,
    tabIndex
}) => (
    <button className={`${className} ${b(modifiers[type])}`} onClick={onClick} disabled={disabled} tabIndex={tabIndex}>
        {children}
    </button>
);

export default Button;
