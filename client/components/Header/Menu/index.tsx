import React from 'react';
import './Menu.css';

import uiStore from '../../../domain/ui-store';
import usersStore from '../../../domain/users-store';

class Menu extends React.Component {
    public onContactsClick = event => {
        event.preventDefault();

        uiStore.toggleLeftPanel();
        uiStore.togglePopup('contacts')();
    };

    public onProfileClick = event => {
        event.preventDefault();

        uiStore.toggleLeftPanel();
        uiStore.togglePopup('profile')();
    };

    public onExitClick = event => {
        event.preventDefault();
        usersStore.logout();
    };

    public render() {
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
