import React from 'react';
import './Menu.css';

import usersStore from '../../../domain/users-store';
import uiStore from '../../../domain/ui-store';

class Menu extends React.Component {
    onContactsClick = event => {
        event.preventDefault();

        uiStore.toggleLeftPanel();
        uiStore.togglePopup('contacts')();
    };

    onProfileClick = event => {
        event.preventDefault();

        uiStore.toggleLeftPanel();
        uiStore.togglePopup('profile')();
    };

    onExitClick = event => {
        event.preventDefault();
        usersStore.logout();
    };

    render() {
        return (
            <nav className="menu">
                <span className="menu__item" onClick={this.onContactsClick}>
                    Контакты
                </span>
                <span className="menu__item" onClick={this.onProfileClick}>
                    Профиль
                </span>
                <span className="menu__item" onClick={this.onExitClick}>
                    Выйти
                </span>
            </nav>
        );
    }
}

export default Menu;
