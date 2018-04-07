import React from 'react';

import './headerMainWrap.css';
import userImage from './userImage.jpg';

const HeaderMainWrap = () => (
    <div className="header__main-wrap">
        <img className="header__user-image" src={userImage} alt=""/>
        <div className="header__user-name"/>
    </div>
);

export default HeaderMainWrap;
