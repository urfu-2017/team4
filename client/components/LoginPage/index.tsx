import React from 'react';
import b_ from 'b_';

import './LoginPage.css';

import Logo from './Logo';

import { AUTH_URL } from '../../config';
const b = b_.with('login-page');

const LoginPage = () => (
    <div className={b()}>
        <div className={b('container')}>
            <Logo className={b('logo')} />
            <h1 className={b('title')}>K1logram</h1>
            <a href={AUTH_URL} className={b('button')}>
                Войти через GitHub
            </a>
        </div>
    </div>
);

export default LoginPage;
