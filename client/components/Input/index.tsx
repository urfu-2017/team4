import React from 'react';
import b_ from 'b_';

import './Input.css';
const b = b_.with('input');

interface Props extends React.HTMLProps<HTMLInputElement> {
    type: 'text' | 'email' | 'password';
    hasError?: boolean;
    innerRef?: (ref: HTMLInputElement) => void;
}

const Index: React.SFC<Props> = ({ className = '', innerRef, hasError, ...props }) => (
    <input
        {...props}
        ref={innerRef}
        className={`${b({ error: hasError })} ${className}`.trim()}
    />
);

export default Index;
