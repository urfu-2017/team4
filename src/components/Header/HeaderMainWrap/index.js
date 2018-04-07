import React from 'react';

import './HeaderMainWrap.css';
import userImage from '../../../fixtures/userImage.jpg';

const HeaderMainWrap = () => (
    <div className="header__main-wrap">
        <img className="header__user-image" src={userImage} alt=""/>
        <div className="header__user-name"/>
    </div>
);

export default HeaderMainWrap;
