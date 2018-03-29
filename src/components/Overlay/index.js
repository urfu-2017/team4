import React from 'react';
import PropTypes from 'prop-types';
import './Overlay.css';

function Overlay(props) {
    return (
        <div className={`${props.className} overlay`} onClick={props.closeHandler}>
            <button className="overlay__close" onClick={props.closeHandler} />
        </div>
    );
}

Overlay.propTypes = {
    closeHandler: PropTypes.func,
    className: PropTypes.string
};

export default Overlay;
