import React from 'react';
import PropTypes from 'prop-types';

import './Preloader.css';

const Preloader = props => (
    <div
        className={`loader ${props.className}`}
        style={{ width: props.size, height: props.size }}
    >
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

Preloader.propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    className: PropTypes.string
};

Preloader.defaultProps = {
    size: 'auto',
    className: '',
    color: '#5682a3'
};

export default Preloader;
