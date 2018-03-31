import React from 'react';
import './menu.css';

const Menu = () => (
    <nav className="menu">
        <ul className="menu__list">
            <li><a className="menu__list-link" href="">Contacts</a></li>
            <li><a className="menu__list-link" href="">Settings</a></li>
        </ul>
    </nav>
);

export default Menu;
