import React from 'react';
import './LoginPage.css';

const LoginPage = () => (
    <div className="login-page">
        <div className="login-page__container">
            <h1 className="login-page__title">Kilogram</h1>
            <a
                href="http://localhost:8080/auth"
                className="login-page__button"
            >
                Войти через GitHub
            </a>
        </div>
    </div>
);

export default LoginPage;
