import React from 'react';

import './headerMainWrap.css';
import userImage from './userImage.jpg';
import mainData from '../index.json';

export default class HeaderMainWrap extends React.Component {
    render() {
        return (
            <div className="header__main-wrap">
                <img className="header__user-image" src={userImage} alt=""/>
                <div className="header__user-name">{mainData[0].user.name}</div>
            </div>
        );
    }
}
