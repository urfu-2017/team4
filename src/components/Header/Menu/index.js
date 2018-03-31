import React from 'react';
import { Link } from 'react-router-dom';
import './menu.css';

const Menu = () => (
    <nav className="menu">
        <ul className="menu__list">
            <li><Link className="menu__list-link" to="#">Contacts</Link></li>
            <li><Link className="menu__list-link" to="#">Settings</Link></li>
        </ul>
    </nav>
);

export default Menu;
