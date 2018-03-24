'use strict';

const rewireMobX = require('react-app-rewire-mobx');

module.exports = (config, env) => {
    config = rewireMobX(config, env);

    return config;
};
