import React from 'react';

import './Preloader.css';

interface Props {
    size?: number;
    color?: string;
    className?: string;
}

const Preloader: React.SFC<Props> = props => (
    <div className={`loader ${props.className}`} style={{ width: props.size, height: props.size }}>
        <svg className="loader__image" viewBox="25 25 50 50">
            <circle
                r="20"
                cx="50"
                cy="50"
                fill="none"
                strokeWidth="3"
                strokeMiterlimit="10"
                stroke={props.color}
                className="loader__image-path"
            />
        </svg>
    </div>
);

export default Preloader;
