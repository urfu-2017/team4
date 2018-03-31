import React from 'react';
import { observer } from 'mobx-react';

import './headerLogoWrap.css';
import Menu from '../Menu/index';
import MenuStore from '../../../domain/menu-store';

@observer
const HeaderLogoWrap = () => (
    <div className="header__logo-wrap">
        {!MenuStore.isShow ? (
            <div
                onClick={MenuStore.toggleLeftPanel()}
                className="header__menu"
                children={'☰'}
            />
        ) : (
            <React.Fragment>
                <div
                    className="header__menu"
                    onClick={MenuStore.toggleLeftPanel()}
                >✖</div>
                <Menu/>
            </React.Fragment>
        )}
        <div className="header__logo">Ki1logram</div>
    </div>
);

export default HeaderLogoWrap;