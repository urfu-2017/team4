'use strict';

const querystring = require('querystring');
const got = require('got');

class Weather {
    constructor(city, temperature) {
        this.city = city;
        this.temperature = temperature;
    }

    static async load(query) {
        try {
            const urlQuery = querystring.stringify({ query });
            const queryResponse = await got.get(`https://www.metaweather.com/api/location/search?${urlQuery}`);
            const location = JSON.parse(queryResponse.body);

            const { woeid, title } = location[0];

            const weatherResponse = await got.get(`https://www.metaweather.com/api/location/${woeid}`);
            const data = JSON.parse(weatherResponse.body);
            const temperature = Math.round(data.consolidated_weather[0].the_temp);

            return new Weather(title, temperature);
        } catch (e) {
            return null;
        }
    }
}

module.exports = Weather;
