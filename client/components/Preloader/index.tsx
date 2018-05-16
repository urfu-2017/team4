import React from 'react';
import { observer } from 'mobx-react';

import uiStore from '../../domain/ui-store';

import './Preloader.css';

interface Props {
    size?: number;
    color?: string;
    className?: string;
}

const Preloader: React.SFC<Props> = observer(
    ({ className, size, color = uiStore.isDark ? '#a8b5be' : '#74669b' }) => (
        <div className={`loader ${className}`} style={{ width: size, height: size }}>
            <svg className="loader__image" viewBox="25 25 50 50">
                <circle
                    r="20"
                    cx="50"
                    cy="50"
                    fill="none"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    stroke={color}
                    className="loader__image-path"
                />
            </svg>
        </div>
    )
);

export default Preloader;
