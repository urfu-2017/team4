import React from 'react';
import PropTypes from 'prop-types';
import './Overlay.css';

function Overlay(props) {
    return (
        /* eslint-disable-next-line */
        <div className={`${props.className} overlay`} onClick={props.closeHandler}>
            <button className="overlay__close" onClick={props.closeHandler}/>
        </div>
    );
}

Overlay.propTypes = {
    /* eslint-disable */
    closeHandler: PropTypes.func,
    className: PropTypes.string
    /* eslint-enable */
};

export default Overlay;
