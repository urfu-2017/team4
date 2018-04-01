'use strict';

/* eslint-disable import/no-extraneous-dependencies, no-param-reassign */

const rewireMobX = require('react-app-rewire-mobx');

module.exports = (config, env) => {
    config = rewireMobX(config, env);
    config.devtool = 'none';

    return config;
};
