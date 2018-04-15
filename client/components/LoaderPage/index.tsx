import React from 'react';
import './LoaderPage.css';
import Spinner from './Spinner';

const LoaderPage = () => (
    <div className="loader-page">
        <Spinner className="loader-page__spinner" />
        <h1 className="loader-page__title header1">K1logram</h1>
    </div>
);

export default LoaderPage;
