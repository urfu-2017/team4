import RPC from './rpc-client';

/**
 * @param {String} city
 * @returns {string}
 */
export const createContainer = city => `
    <span class="weather" data-city="${city}">
        <span class="weather__city">${city}</span>
        <span class="weather__result">Данные о погоде загружаются</span>
    </span>
`;

const loadWeather = async event => {
    const weatherBox = event.currentTarget;
    const resultBox = weatherBox.querySelector('.weather__result');
    resultBox.classList.toggle('weather__result--open');

    const { city, loading, loaded } = weatherBox.dataset;

    if (loading || loaded) {
        return;
    }

    weatherBox.dataset.loading = true;

    try {
        const weather: any = await RPC.request('fetchWeather', { city });
        resultBox.textContent =
            weather !== null
                ? `Сегодня в ${city} ${weather.temperature}℃`
                : 'Не удалось загрузить данные о погоде';
    } finally {
        weatherBox.dataset.loaded = true;
        weatherBox.dataset.loading = false;
    }
};

/**
 * @param {HTMLElement} element
 */
export const initContainer = element => {
    const weatherContainer = element.querySelector('.weather');

    if (!weatherContainer || !weatherContainer.dataset.city) {
        return;
    }

    weatherContainer.addEventListener('click', loadWeather);
};
