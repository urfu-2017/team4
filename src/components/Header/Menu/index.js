import React from 'react';
import './Menu.css';

import uiStore from '../../../domain/ui-store';
import menuStore from '../../../domain/menu-store';

class Menu extends React.Component {
    onContactsClick = (event) => {
        event.preventDefault();

        menuStore.toggleLeftPanel();
        uiStore.togglePopup('contacts')();
    };

    onProfileClick = (event) => {
        event.preventDefault();

        menuStore.toggleLeftPanel();
        uiStore.togglePopup('profile')();
    };

    render() {
        return (
            <nav className="menu">
                <ul className="menu__list">
                    <li>
                        <a className="menu__list-link" href="/" onClick={this.onContactsClick}>Контакты</a>
                    </li>
                    <li>
                        <a className="menu__list-link" href="/" onClick={this.onProfileClick}>Профиль</a>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Menu;
