import React from 'react';
import PropTypes from 'prop-types';
import './Overlay.css';

class Overlay extends React.Component {
    componentDidMount() {
        window.addEventListener('keydown', this.onEscPress);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onEscPress);
    }

    onEscPress = (event) => {
        if (event.key === 'Escape') {
            this.props.closeHandler();
        }
    };

    onCloseButtonPress = (event) => {
        event.stopPropagation();
        this.props.closeHandler();
    };

    render() {
        return (
            // eslint-disable-next-line
            <div
                className={`overlay ${this.props.className}`}
                onClick={this.props.closeHandler}
                style={{ zIndex: this.props.zIndex }}
            >
                <button className="overlay__close" onClick={this.onCloseButtonPress}/>
            </div>
        );
    }
}

Overlay.propTypes = {
    closeHandler: PropTypes.func.isRequired,
    className: PropTypes.string,
    zIndex: PropTypes.number.isRequired
};

Overlay.defaultProps = {
    className: ''
};

export default Overlay;
