import React from 'react';
import b_ from 'b_';
import { observer } from 'mobx-react';

import './Input.css';

import uiStore from '../../domain/ui-store';

const b = b_.with('input');

interface Props extends React.HTMLProps<HTMLInputElement> {
    type: 'text' | 'email' | 'password';
    hasError?: boolean;
    innerRef?: (ref: HTMLInputElement) => void;
}

const Input: React.SFC<Props> = observer(({ className = '', innerRef, hasError, ...props }) => (
    <input
        {...props}
        ref={innerRef}
        className={`${b({ error: hasError, dark: uiStore.isDark })} ${className}`.trim()}
    />
));

export default Input;
