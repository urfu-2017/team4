'use surict';

import React from 'react';

import './headerLogoWrap.css';
import mainData from '../index.json';
import Menu from '../menu/menu';

export default class HeaderLogoWrap extends React.Component {
    state = { stateMenu: false }

    show = () => this.setState({ stateMenu: true })
    close = () => this.setState({ stateMenu: false })

    render() {
        const { stateMenu } = this.state;

        return (
            <div className="header__logo-wrap" onClick={stateMenu ? this.close : this.show}>
                {stateMenu
                    ? (
                        <React.Fragment>
                            <div className="header__menu">✖</div>
                            <Menu />
                        </React.Fragment>
                    ) : <div className="header__menu">☰</div>}
                <div className="header__logo">{mainData[0].title}</div>
            </div>
        );
    }
}
