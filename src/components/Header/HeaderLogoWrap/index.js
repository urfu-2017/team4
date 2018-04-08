import React from 'react';
import { observer } from 'mobx-react';

import './HeaderLogoWrap.css';
import Menu from '../Menu';
import menuStore from '../../../domain/menu-store';

/* eslint-disable */

const HeaderLogoWrap = observer(() => (
    <div className="header__logo-wrap">
        {!menuStore.isShow ? (
            <div
                onClick={menuStore.toggleLeftPanel}
                className="header__menu"
            >
                ☰
            </div>
        ) : (
            <React.Fragment>
                <div
                    className="header__menu"
                    onClick={menuStore.toggleLeftPanel}
                >
                    ✖
                </div>
                <Menu/>
            </React.Fragment>
        )}
        <div className="header__logo">K1logram</div>
    </div>
));

export default HeaderLogoWrap;
