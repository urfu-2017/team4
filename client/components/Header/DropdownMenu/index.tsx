import React from 'react';
import b_ from 'b_';

import './DropdownMenu.css';

import uiStore from '../../../domain/ui-store';
import usersStore from '../../../domain/users-store';

const b = b_.with('menu');

class DropdownMenu extends React.Component {
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

    public onGroupClick = event => {
        event.preventDefault();

        uiStore.toggleLeftPanel();
        uiStore.togglePopup('createRoom')();
    };

    public onExitClick = event => {
        event.preventDefault();
        usersStore.logout();
    };

    public render() {
        return (
            <nav className={b()}>
                <span className={b('item')} onClick={this.onGroupClick}>
                    Создать групповой чат
                </span>
                <span className={b('item')} onClick={this.onContactsClick}>
                    Контакты
                </span>
                <span className={b('item')} onClick={this.onProfileClick}>
                    Профиль
                </span>
                <span className={b('item')} onClick={this.onExitClick}>
                    Выйти
                </span>
            </nav>
        );
    }
}

export default DropdownMenu;
