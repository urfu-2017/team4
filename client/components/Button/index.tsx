import React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import b_ from 'b_';

import './Button.css';

const modifiers = {
    main: { theme: 'main' },
    heading: { theme: 'heading' },
    dark: { theme: 'dark' }
};

const b = b_.with('button');

interface Props {
    className?: string;
    type?: 'main' | 'heading' | 'dark';
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
    <button
        className={classNames(className, b(modifiers[type]))}
        onClick={onClick}
        disabled={disabled}
        tabIndex={tabIndex}
    >
        {children}
    </button>
);

export default observer(Button);
