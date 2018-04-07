import React from 'react';
// import { Link } from 'react-router-dom';
import './Menu.css';

import uiStore from '../../../domain/ui-store';

const Menu = () => (
    <nav className="menu">
        <ul className="menu__list">
            <li>
                {/* eslint-disable-next-line */}
                <a className="menu__list-link" href="#" onClick={uiStore.toggleContacts}>Contacts</a>
            </li>
            <li>
                {/* eslint-disable-next-line */}
                <a className="menu__list-link" href="#">Settings</a>
            </li>
        </ul>
    </nav>
);

export default Menu;
