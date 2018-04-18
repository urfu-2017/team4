import React from 'react';

import './Header.css';
import HeaderLogoWrap from './HeaderLogoWrap';
import HeaderMainWrap from './HeaderMainWrap';

const Header = () => (
    <header className="header">
        <HeaderLogoWrap />
        <HeaderMainWrap />
    </header>
);

export default Header;
