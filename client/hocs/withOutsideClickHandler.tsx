import React from 'react';
import ReactDOM from 'react-dom';

import getDisplayName from '../utils/get-display-name';

export const withOutsideClickHandler = (Component, handler): React.ComponentClass<any> =>
    class extends React.Component {
        public static displayName = `WithOutsideClickHandler(${getDisplayName(Component)})`;

        public componentDidMount() {
            document.addEventListener('click', this.handleClickOutside, false);
        }

        public componentWillUnmount() {
            document.removeEventListener('click', this.handleClickOutside, false);
        }

        public render() {
            return <Component {...this.props} />;
        }

        private handleClickOutside = event => {
            const domNode = ReactDOM.findDOMNode(this);

            if (!domNode || !domNode.contains(event.target)) {
                handler();
            }
        };
    };
