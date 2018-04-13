import React from 'react';
import './LoginPage.css';
import Logo from './Logo';

import { AUTH_URL } from '../../config';

const LoginPage = () => (
    <div className="login-page">
        <div className="login-page__container">
            <Logo className="login-page__logo"/>
            <h1 className="login-page__title">K1logram</h1>
            <a href={AUTH_URL} className="login-page__button">
                Войти через GitHub
            </a>
        </div>
    </div>
);

export default LoginPage;
