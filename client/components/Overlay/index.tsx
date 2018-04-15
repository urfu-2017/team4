import React from 'react';
import './Overlay.css';

interface Props {
    closeHandler: () => void;
    zIndex?: number;
    className?: string;
}

class Overlay extends React.Component<Props> {
    public componentDidMount() {
        window.addEventListener('keydown', this.onEscPress);
    }

    public componentWillUnmount() {
        window.removeEventListener('keydown', this.onEscPress);
    }

    public onEscPress = event => {
        if (event.key === 'Escape') {
            this.props.closeHandler();
        }
    };

    public onCloseButtonPress = event => {
        event.stopPropagation();
        this.props.closeHandler();
    };

    public render() {
        return (
            // eslint-disable-next-line
            <div
                className={`overlay ${this.props.className}`}
                onClick={this.props.closeHandler}
                style={{ zIndex: this.props.zIndex }}
            >
                <button className="overlay__close" onClick={this.onCloseButtonPress} />
            </div>
        );
    }
}

export default Overlay;
