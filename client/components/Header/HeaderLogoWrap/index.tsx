import { observer } from 'mobx-react';
import React from 'react';
import b from 'b_';

import './HeaderLogoWrap.css';

import UIStore from '../../../domain/ui-store';
import DropdownMenu from '../DropdownMenu';

const HeaderLogoWrap = observer(() => (
    <div className={b('header', 'logo-wrap')}>
        <div
            onClick={UIStore.toggleLeftPanel}
            className={`${b('hamburger', { active: UIStore.isMenuShown })} ${b('header', 'menu')}`}
        >
            <div className={b('hamburger', 'box')}>
                <div className={b('hamburger', 'inner')} />
            </div>
        </div>
        {UIStore.isMenuShown && <DropdownMenu />}
        <div className={b('header', 'logo')}>K1logram</div>
    </div>
));

export default HeaderLogoWrap;
