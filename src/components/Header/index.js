import React from 'react';

import './index.css';
import HeaderMainWrap from './HeaderMainWrap';
import HeaderLogoWrap from './HeaderLogoWrap';

const Header = () => (
    <header className="header">
        <HeaderLogoWrap/>
        <HeaderMainWrap/>
    </header>
);

export default Header;
