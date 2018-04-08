import React from 'react';
import { observer } from 'mobx-react';

import './HeaderLogoWrap.css';
import Menu from '../Menu';
import menuStore from '../../../domain/menu-store';

/* eslint-disable */

const HeaderLogoWrap = observer(() => (
    <div className="header__logo-wrap">
        <div
            onClick={menuStore.toggleLeftPanel}
            className={`header__menu hamburger ${menuStore.isShow ? 'hamburger--active' : ''}`.trim()}
        >
            <div className="hamburger__box">
                <div className="hamburger__inner"></div>
            </div>
        </div>
        {menuStore.isShow && <Menu/>}
        <div className="header__logo">K1logram</div>
    </div>
));

export default HeaderLogoWrap;
