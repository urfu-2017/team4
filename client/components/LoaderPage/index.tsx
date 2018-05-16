import React from 'react';
import b_ from 'b_';
import { observer } from 'mobx-react';

import './LoaderPage.css';

import Spinner from './Spinner';

import uiStore from '../../domain/ui-store';

const b = b_.with('loader-page');

const LoaderPage = observer(() => (
    <div className={b()}>
        <Spinner className={b('spinner', { dark: uiStore.isDark})} />
        <h1 className={`${b('title', { dark: uiStore.isDark })} header1`}>K1logram</h1>
    </div>
));

export default LoaderPage;
