import React from 'react';
import './menu.css';

const Menu = () => (
    <nav className="menu">
        <ul className="menu__list">
            <li><a className="menu__list-link" href="http://localhost:8080/">Contacts</a></li>
            <li><a className="menu__list-link" href="http://localhost:8080/">Settings</a></li>
        </ul>
    </nav>
);

export default Menu;
