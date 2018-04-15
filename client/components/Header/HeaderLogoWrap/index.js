import React from 'react';
import { observer } from 'mobx-react';

import './HeaderLogoWrap.css';
import Menu from '../Menu';
import UIStore from '../../../domain/ui-store';

/* eslint-disable */

const HeaderLogoWrap = observer(() => (
    <div className="header__logo-wrap">
        <div
            onClick={UIStore.toggleLeftPanel}
            className={`header__menu hamburger ${
                UIStore.menuShow ? 'hamburger--active' : ''
            }`.trim()}
        >
            <div className="hamburger__box">
                <div className="hamburger__inner" />
            </div>
        </div>
        {UIStore.menuShow && <Menu />}
        <div className="header__logo">K1logram</div>
    </div>
));

export default HeaderLogoWrap;
