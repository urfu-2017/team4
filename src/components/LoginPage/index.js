import React from 'react';
import './LoginPage.css';
import logo from './logo.svg';

import { AUTH_URL } from '../../config';

const LoginPage = () => (
    <div className="login-page">
        <div className="login-page__container">
            <img className="login-page__logo" src={logo} alt=""/>
            <h1 className="login-page__title">K1logram</h1>
            <a href={AUTH_URL} className="login-page__button">
                Войти через GitHub
            </a>
        </div>
    </div>
);

export default LoginPage;
