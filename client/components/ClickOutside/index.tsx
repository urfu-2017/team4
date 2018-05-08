import React from 'react';

interface Props {
    className?: string;
    onClickOutside: () => void;
}

class ClickOutside extends React.PureComponent<Props> {
    private container: HTMLElement;

    public componentDidMount() {
        document.addEventListener('click', this.handleClick);
    }

    public componentWillUnmount() {
        document.removeEventListener('click', this.handleClick);
    }

    public render(): React.ReactNode {
        const { className, children } = this.props;
        return (
            <div ref={el => (this.container = el!)} className={className}>
                {children}
            </div>
        );
    }

    private handleClick = (event: Event) => {
        if (!this.container.contains(event.target as Node)) {
            this.props.onClickOutside();
        }
    }
}

export default ClickOutside;
