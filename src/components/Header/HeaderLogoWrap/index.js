import React from 'react';
import { observer } from 'mobx-react';

import './headerLogoWrap.css';
import Menu from '../Menu/index';
import MenuStore from '../../../domain/menu-store';

@observer
export default class HeaderLogoWrap extends React.Component {
    toogle = () => {
        MenuStore.toggleLeftPanel();
    }

    render() {
        return (
            <div className="header__logo-wrap">
                {!MenuStore.isShow ? (
                    <div
                        onClick={this.toogle}
                        className="header__menu"
                        children={'☰'}
                    />
                ) : (
                    <React.Fragment>
                        <div
                            className="header__menu"
                            onClick={this.toogle}
                        >✖</div>
                        <Menu/>
                    </React.Fragment>
                )}
                <div className="header__logo">Ki1logram</div>
            </div>
        );
    }
}
