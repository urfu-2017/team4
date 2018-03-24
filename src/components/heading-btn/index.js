import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const HeadingBtn = ({ children, onClick, className }) => (
    <button className={`${className} btn_heading`} onClick={onClick}>
        {children}
    </button>
);

HeadingBtn.propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node
};

export default HeadingBtn;
