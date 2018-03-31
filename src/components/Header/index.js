import React from 'react';

import './index.css';
import HeaderMainWrap from './headerMainWrap/headerMainWrap';
import HeaderLogoWrap from './headerLogoWrap/headerLogoWrap';

export default class Header extends React.Component {
    render() {
        return (
            <header className="header">
                <HeaderLogoWrap/>
                <HeaderMainWrap/>
            </header>
        );
    }
}
