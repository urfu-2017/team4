import React from 'react';
import b_ from 'b_';

import './LoaderPage.css';

import Spinner from './Spinner';

const b = b_.with('loader-page');

const LoaderPage = () => (
    <div className={b()}>
        <Spinner className={b('spinner')} />
        <h1 className={`${b('title')} header1`}>K1logram</h1>
    </div>
);

export default LoaderPage;
