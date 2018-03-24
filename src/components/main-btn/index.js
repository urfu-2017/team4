import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const MainBtn = ({ children, onClick, className }) => (
    <button className={`${className} btn_main`} onClick={onClick}>
        {children}
    </button>
);

MainBtn.propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node
};

export default MainBtn;
