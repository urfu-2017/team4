import React from 'react';
// import { Link } from 'react-router-dom';
import './Menu.css';

import uiStore from '../../../domain/ui-store';

class Menu extends React.Component {
    onClick = (event) => {
        event.preventDefault();
        uiStore.toggleContacts();
    };

    render() {
        return (
            <nav className="menu">
                <ul className="menu__list">
                    <li>
                        <a className="menu__list-link" href="/" onClick={this.onClick}>Contacts</a>
                    </li>
                    <li>
                        <a className="menu__list-link" href="/">Settings</a>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Menu;
