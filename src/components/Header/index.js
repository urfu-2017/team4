import React from 'react';

import './index.css';
import HeaderMainWrap from './HeaderMainWrap/index';
import HeaderLogoWrap from './HeaderLogoWrap/index';

const Header = () => (
    <header className="header">
        <HeaderLogoWrap/>
        <HeaderMainWrap/>
    </header>
);

export default Header;
