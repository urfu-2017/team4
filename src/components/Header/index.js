import React from 'react';

import './index.css';
import HeaderMainWrap from './HeaderMainWrap/index';
import HeaderLogoWrap from './HeaderLogoWrap/index';

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
