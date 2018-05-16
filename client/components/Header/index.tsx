import React from 'react';
import b from 'b_';
import { observer } from 'mobx-react';

import HeaderLogoWrap from './HeaderLogoWrap';
import HeaderMainWrap from './HeaderMainWrap';

import uiStore from '../../domain/ui-store';

import { withOutsideClickHandler } from '../../hocs/withOutsideClickHandler';

import './Header.css';

const HeaderLogoWrapWithHandler = withOutsideClickHandler(
    HeaderLogoWrap,
    uiStore.toggleLeftPanel
);

const Header: React.SFC = observer(() => (
    <header className={b('header', { dark: uiStore.isDark })}>
        <HeaderLogoWrapWithHandler />
        <HeaderMainWrap />
    </header>
));

export default Header;
