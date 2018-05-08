import React from 'react';
import b_ from 'b_';

import ClickOutside from '../../ClickOutside';

import uiStore from '../../../domain/ui-store';
import usersStore from '../../../domain/users-store';

import './DropdownMenu.css';
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

    public onClickOutside = () => {
        uiStore.toggleLeftPanel();
    }

    public render() {
        return (
            <ClickOutside onClickOutside={this.onClickOutside} className={b()}>
                <nav>
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
            </ClickOutside>
        );
    }
}

export default DropdownMenu;
