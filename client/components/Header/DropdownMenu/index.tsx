import React from 'react';
import b_ from 'b_';
import { observer } from 'mobx-react';

import uiStore from '../../../domain/ui-store';
import usersStore from '../../../domain/users-store';

import './DropdownMenu.css';
const b = b_.with('menu');

@observer
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
        const dark = uiStore.isDark;

        return (
            <nav className={b( { dark })}>
                <span className={b('item', { dark })} onClick={this.onGroupClick}>
                    Создать групповой чат
                </span>
                <span className={b('item', { dark })} onClick={this.onContactsClick}>
                    Контакты
                </span>
                <span className={b('item', { dark })} onClick={this.onProfileClick}>
                    Профиль
                </span>
                <span className={b('item', { dark })} onClick={uiStore.toggleTheme}>
                    Переключить на {uiStore.isDark ? 'дневную' : 'ночную'} тему
                </span>
                <span className={b('item', { dark })} onClick={this.onExitClick}>
                    Выйти
                </span>
            </nav>
        );
    }
}

export default DropdownMenu;
