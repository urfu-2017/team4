import { observer } from 'mobx-react';
import React from 'react';

import UIStore from '../../../domain/ui-store';
import Menu from '../Menu';
import './HeaderLogoWrap.css';

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
