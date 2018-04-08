import React from 'react';
import './LoaderPage.css';
import spinnerIcon from './spinner.svg';

const LoaderPage = () => (
    <div className="loader-page">
        <img className="loader-page__spinner" src={spinnerIcon} alt=""/>
        <h1 className="loader-page__title header1">K1logram</h1>
    </div>
);

export default LoaderPage;
