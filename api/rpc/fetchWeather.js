'use strict';

const Weather = require('../models/weather');

module.exports = async (params, response) => {
    const weather = await Weather.load(params.city);
    response.success(weather);
};
