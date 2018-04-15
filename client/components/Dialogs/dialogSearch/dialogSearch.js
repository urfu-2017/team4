import React from 'react';

import './dialogSearch.css';

export default class DialogSearch extends React.Component {
    render() {
        return (
            <div className="dialogs__dialogs-search">
                <input type="text" className="dialogs__input" placeholder="Search" />
            </div>
        );
    }
}
